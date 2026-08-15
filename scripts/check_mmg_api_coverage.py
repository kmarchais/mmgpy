"""Validate the documented MMG C API coverage against the pinned headers.

The audit has two deterministic inputs:

* callable declarations in MMG's public ``libmmg*.h`` headers;
* direct symbol references in ``src/bindings`` after comments and literals are
  removed.

The coverage document remains the source of truth for semantic classifications
such as ``Indirect``, ``Candidate``, ``Excluded``, and ``Skipped``. Those
decisions cannot be inferred safely from spelling alone. The checker fails when
MMG adds or removes an API, when a directly referenced function is not labelled
``Bound``, or when the summary counts drift. ``--write`` repairs direct-binding
statuses and the summary table; new functions still require a human
classification and note.
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

import tomllib

_LIBRARIES = ("MMG3D", "MMG2D", "MMGS")
_HEADER_PATHS = {
    "MMG3D": Path("src/mmg3d/libmmg3d.h"),
    "MMG2D": Path("src/mmg2d/libmmg2d.h"),
    "MMGS": Path("src/mmgs/libmmgs.h"),
}
_STATUSES = ("Bound", "Indirect", "Candidate", "Excluded", "Skipped")
_INTENTIONALLY_INDIRECT_PARAMS = frozenset({
    "MMG3D_IPARAM_lag",
    "MMG3D_IPARAM_renum",
    "MMG2D_IPARAM_lag",
    "MMGS_IPARAM_renum",
})
_ROW_RE = re.compile(
    r"^(?P<lead>\|\s*`(?P<symbol>MMG(?:3D|2D|S)_[A-Za-z0-9_]+)`\s*\|\s*)"
    r"(?P<status>Bound|Indirect|Candidate|Excluded|Skipped)"
    r"(?P<trail>\s*\|.*)$",
    re.MULTILINE,
)
_ROW_LINE_RE = re.compile(
    r"^(?P<lead>\|\s*`(?P<symbol>MMG(?:3D|2D|S)_[A-Za-z0-9_]+)`\s*\|)"
    r"\s*(?P<status>Bound|Indirect|Candidate|Excluded|Skipped)\s*(?P<trail>\|.*)$",
)
_SUMMARY_RE = re.compile(
    r"^\|\s*(?P<library>MMG3D|MMG2D|MMGS)\s*\|"
    r"(?P<values>.*)\|$",
    re.MULTILINE,
)
_COMMENT_RE = re.compile(r"/\*.*?\*/|//[^\r\n]*", re.DOTALL)
_CPP_LITERAL_RE = re.compile(
    r'R"(?P<delimiter>[^\s()\\]{0,16})\(.*?\)(?P=delimiter)"'
    r'|"(?:\\.|[^"\\])*"'
    r"|'(?:\\.|[^'\\])*'",
    re.DOTALL,
)
_PREPROCESSOR_RE = re.compile(r"^[ \t]*#(?:.*\\\r?\n)*.*$", re.MULTILINE)
_MMG_VERSION_RE = re.compile(
    r'CMAKE_RELEASE_VERSION_(MAJOR|MINOR|PATCH)\s+"([0-9]+)"',
)


@dataclass(frozen=True)
class CoverageRow:
    """One classified function from the coverage document."""

    symbol: str
    status: str


@dataclass(frozen=True)
class LibraryAudit:
    """Coverage facts and validation errors for one MMG library."""

    library: str
    public_symbols: frozenset[str]
    rows: tuple[CoverageRow, ...]
    direct_symbols: frozenset[str]

    @property
    def documented_symbols(self) -> frozenset[str]:
        """Set of documented API symbols."""
        return frozenset(row.symbol for row in self.rows)

    @property
    def counts(self) -> dict[str, int]:
        """Counts for every documented status."""
        return {
            status: sum(row.status == status for row in self.rows)
            for status in _STATUSES
        }

    @property
    def errors(self) -> tuple[str, ...]:
        """Deterministic coverage inconsistencies."""
        errors: list[str] = []
        missing = sorted(self.public_symbols - self.documented_symbols)
        removed = sorted(self.documented_symbols - self.public_symbols)
        if missing:
            errors.append(f"undocumented public functions: {', '.join(missing)}")
        if removed:
            errors.append(
                f"documented functions absent from header: {', '.join(removed)}"
            )

        status_by_symbol = {row.symbol: row.status for row in self.rows}
        stale = sorted(
            symbol
            for symbol in self.direct_symbols & self.documented_symbols
            if status_by_symbol[symbol] != "Bound"
        )
        if stale:
            errors.append(f"directly referenced but not Bound: {', '.join(stale)}")

        unsupported_bound = sorted(
            symbol
            for symbol, status in status_by_symbol.items()
            if status == "Bound" and symbol not in self.direct_symbols
        )
        if unsupported_bound:
            errors.append(
                "labelled Bound without a binding reference: "
                + ", ".join(unsupported_bound),
            )
        return tuple(errors)


def _strip_c_comments(text: str) -> str:
    """Remove C and C++ comments while preserving declarations."""
    return _COMMENT_RE.sub(" ", text)


def extract_public_symbols(header: Path, prefix: str) -> frozenset[str]:
    """Extract callable declarations for ``prefix`` from a public MMG header."""
    text = _strip_c_comments(header.read_text(encoding="utf-8"))
    text = _PREPROCESSOR_RE.sub("", text)
    normal = re.compile(rf"\b({prefix}_[A-Za-z0-9_]+)\s*\(")
    pointer = re.compile(
        rf"\(\s*\*\s*({prefix}_[A-Za-z0-9_]+)\s*\)\s*\(",
    )
    symbols: set[str] = set()
    for statement in text.split(";"):
        if "typedef" in statement:
            continue
        pointer_match = pointer.search(statement)
        if pointer_match:
            symbols.add(pointer_match.group(1))
            continue
        matches = normal.findall(statement)
        if matches:
            symbols.add(matches[-1])
    return frozenset(symbols)


def extract_public_parameters(header: Path, prefix: str) -> frozenset[str]:
    """Extract integer and double parameter constants from a public header."""
    text = _strip_c_comments(header.read_text(encoding="utf-8"))
    return frozenset(re.findall(rf"\b{prefix}_[ID]PARAM_[A-Za-z0-9_]+\b", text))


def parse_document_rows(document: str, library: str) -> tuple[CoverageRow, ...]:
    """Parse unique coverage rows belonging to ``library``."""
    rows = [
        CoverageRow(match.group("symbol"), match.group("status"))
        for match in _ROW_RE.finditer(document)
        if match.group("symbol").startswith(f"{library}_")
    ]
    symbols = [row.symbol for row in rows]
    duplicates = sorted({symbol for symbol in symbols if symbols.count(symbol) > 1})
    if duplicates:
        msg = f"duplicate {library} coverage rows: {', '.join(duplicates)}"
        raise ValueError(msg)
    return tuple(rows)


def scan_direct_symbols(
    bindings_dir: Path, candidates: frozenset[str]
) -> frozenset[str]:
    """Return candidate MMG symbols referenced by C++ binding code."""
    chunks: list[str] = []
    for path in sorted(bindings_dir.rglob("*")):
        if path.suffix not in {".cpp", ".h", ".hpp"}:
            continue
        text = _strip_c_comments(path.read_text(encoding="utf-8"))
        chunks.append(_CPP_LITERAL_RE.sub(" ", text))
    source = "\n".join(chunks)
    return frozenset(
        symbol
        for symbol in candidates
        if re.search(rf"(?<![A-Za-z0-9_]){re.escape(symbol)}(?![A-Za-z0-9_])", source)
    )


def find_mmg_source(repo_root: Path, explicit: Path | None = None) -> Path:
    """Locate an MMG source tree containing all three public headers."""
    candidates = [explicit] if explicit is not None else []
    candidates.extend(
        (
            repo_root / "build" / "_deps" / "mmg-src",
            repo_root / "_skbuild" / "_deps" / "mmg-src",
        ),
    )
    for candidate in candidates:
        if candidate is None:
            continue
        resolved = candidate.resolve()
        if all((resolved / relative).is_file() for relative in _HEADER_PATHS.values()):
            return resolved
    searched = ", ".join(str(path) for path in candidates if path is not None)
    msg = (
        "Unable to locate MMG public headers. Build mmgpy first or pass "
        f"--mmg-source. Searched: {searched}"
    )
    raise FileNotFoundError(msg)


def read_pinned_mmg_version(repo_root: Path) -> str:
    """Read the MMG version selected by mmgpy's build configuration."""
    with (repo_root / "pyproject.toml").open("rb") as stream:
        project = tomllib.load(stream)
    return str(project["tool"]["mmgpy"]["mmg_version"])


def read_mmg_source_version(mmg_source: Path) -> str:
    """Read the release version declared by an MMG source tree."""
    cmake = (mmg_source / "CMakeLists.txt").read_text(encoding="utf-8")
    parts = dict(_MMG_VERSION_RE.findall(cmake))
    required = ("MAJOR", "MINOR", "PATCH")
    if any(part not in parts for part in required):
        msg = f"Unable to determine MMG version from {mmg_source / 'CMakeLists.txt'}"
        raise ValueError(msg)
    return ".".join(parts[part] for part in required)


def validate_mmg_source_version(repo_root: Path, mmg_source: Path) -> None:
    """Reject a source tree that does not match the version pinned by mmgpy."""
    pinned = read_pinned_mmg_version(repo_root)
    actual = read_mmg_source_version(mmg_source)
    if actual != pinned:
        msg = f"MMG source version {actual} does not match pinned version {pinned}"
        raise ValueError(msg)


def build_audits(
    *,
    mmg_source: Path,
    bindings_dir: Path,
    document: str,
) -> tuple[LibraryAudit, ...]:
    """Build coverage audits for MMG3D, MMG2D, and MMGS."""
    audits: list[LibraryAudit] = []
    for library in _LIBRARIES:
        public_symbols = extract_public_symbols(
            mmg_source / _HEADER_PATHS[library],
            library,
        )
        audits.append(
            LibraryAudit(
                library=library,
                public_symbols=public_symbols,
                rows=parse_document_rows(document, library),
                direct_symbols=scan_direct_symbols(bindings_dir, public_symbols),
            ),
        )
    return tuple(audits)


def _summary_line(audit: LibraryAudit) -> str:
    """Render one Markdown summary row."""
    counts = audit.counts
    functional = counts["Bound"] + counts["Indirect"]
    percentage = round(100 * functional / len(audit.public_symbols))
    return (
        f"| {audit.library:<7} | {len(audit.public_symbols):5d} |"
        f" {counts['Bound']:5d} | {counts['Indirect']:8d} |"
        f" {counts['Candidate']:9d} | {counts['Excluded']:8d} |"
        f" {counts['Skipped']:7d} |"
        f" {percentage:18d}% |"
    )


def rewrite_document(
    document: str,
    audits: tuple[LibraryAudit, ...],
    *,
    mmg_source: Path,
    bindings_dir: Path,
) -> str:
    """Mark direct references Bound and regenerate summary rows."""
    direct = frozenset().union(*(audit.direct_symbols for audit in audits))
    status_width: int | None = None
    updated_lines: list[str] = []
    for line in document.splitlines(keepends=True):
        stripped = line.rstrip("\r\n")
        newline = line[len(stripped) :]
        if stripped.startswith("| --------") and status_width is None:
            cells = [cell.strip() for cell in stripped.strip("|").split("|")]
            if len(cells) >= 2:
                status_width = len(cells[1])
        match = _ROW_LINE_RE.match(stripped)
        if match and status_width is not None:
            symbol = match.group("symbol")
            status = match.group("status")
            if symbol in direct:
                status = "Bound"
            stripped = (
                f"{match.group('lead')} {status:<{status_width}} {match.group('trail')}"
            )
        if not stripped.startswith("|"):
            status_width = None
        updated_lines.append(f"{stripped}{newline}")

    updated = "".join(updated_lines)
    refreshed = build_audits(
        mmg_source=mmg_source,
        bindings_dir=bindings_dir,
        document=updated,
    )
    summary_by_library = {audit.library: _summary_line(audit) for audit in refreshed}

    def replace_summary(match: re.Match[str]) -> str:
        return summary_by_library[match.group("library")]

    return _SUMMARY_RE.sub(replace_summary, updated)


def validate_summary(
    document: str, audits: tuple[LibraryAudit, ...]
) -> tuple[str, ...]:
    """Return errors for summary rows that do not match detailed classifications."""
    summary = {
        match.group("library"): match.group(0)
        for match in _SUMMARY_RE.finditer(document)
    }
    errors: list[str] = []
    for audit in audits:
        expected = _summary_line(audit)
        if summary.get(audit.library) != expected:
            errors.append(
                f"{audit.library}: stale summary row\n"
                f"  expected: {expected}\n"
                f"  actual:   {summary.get(audit.library, '<missing>')}",
            )
    return tuple(errors)


def validate_parameter_coverage(
    mmg_source: Path, bindings_dir: Path
) -> tuple[str, ...]:
    """Ensure every public MMG option is mapped or intentionally indirect."""
    public: set[str] = set()
    for library in _LIBRARIES:
        public.update(
            extract_public_parameters(mmg_source / _HEADER_PATHS[library], library)
        )
    mapped = scan_direct_symbols(bindings_dir, frozenset(public))
    uncovered = sorted(public - mapped - _INTENTIONALLY_INDIRECT_PARAMS)
    obsolete = sorted(_INTENTIONALLY_INDIRECT_PARAMS - public)
    errors: list[str] = []
    if uncovered:
        errors.append(f"unmapped public parameters: {', '.join(uncovered)}")
    if obsolete:
        errors.append(f"obsolete indirect parameters: {', '.join(obsolete)}")
    return tuple(errors)


def _build_parser() -> argparse.ArgumentParser:
    """Create the command-line parser."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mmg-source", type=Path, help="Path to the MMG source tree")
    parser.add_argument(
        "--write", action="store_true", help="Repair statuses and summary"
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    """Run the coverage audit."""
    args = _build_parser().parse_args(argv)
    repo_root = Path(__file__).resolve().parents[1]
    document_path = repo_root / "docs" / "reference" / "mmg-api-coverage.md"
    bindings_dir = repo_root / "src" / "bindings"
    mmg_source = find_mmg_source(repo_root, args.mmg_source)
    validate_mmg_source_version(repo_root, mmg_source)
    document = document_path.read_text(encoding="utf-8")

    audits = build_audits(
        mmg_source=mmg_source,
        bindings_dir=bindings_dir,
        document=document,
    )
    if args.write:
        document = rewrite_document(
            document,
            audits,
            mmg_source=mmg_source,
            bindings_dir=bindings_dir,
        )
        document_path.write_text(document, encoding="utf-8")
        audits = build_audits(
            mmg_source=mmg_source,
            bindings_dir=bindings_dir,
            document=document,
        )

    errors = [f"{audit.library}: {error}" for audit in audits for error in audit.errors]
    errors.extend(validate_summary(document, audits))
    errors.extend(validate_parameter_coverage(mmg_source, bindings_dir))
    if errors:
        print("MMG API coverage audit failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        if not args.write:
            print("Run with --write to repair direct-binding drift.", file=sys.stderr)
        return 1

    for audit in audits:
        print(_summary_line(audit))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
