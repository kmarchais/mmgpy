"""Tests for deterministic MMG public API coverage auditing."""

from __future__ import annotations

from pathlib import Path

from scripts.check_mmg_api_coverage import (
    build_audits,
    extract_public_parameters,
    extract_public_symbols,
    find_mmg_source,
    read_mmg_source_version,
    read_pinned_mmg_version,
    validate_parameter_coverage,
    validate_summary,
)

_REPO_ROOT = Path(__file__).resolve().parents[1]


def test_extract_public_symbols_includes_functions_and_function_pointers(
    tmp_path: Path,
) -> None:
    """Public declarations are found without counting macros and comments."""
    header = tmp_path / "libmmg3d.h"
    header.write_text(
        """
        /* MMG3D_Fake_comment(); */
        #define MMG3D_CALL(x) x
        LIBMMG3D_EXPORT int MMG3D_Do_work(int value);
        LIBMMG3D_EXPORT extern int (*MMG3D_callback)(double value);
        typedef int (*MMG3D_CallbackType)(int value);
        enum MMG3D_Param { MMG3D_IPARAM_example, MMG3D_DPARAM_example };
        """,
        encoding="utf-8",
    )

    assert extract_public_symbols(header, "MMG3D") == {
        "MMG3D_Do_work",
        "MMG3D_callback",
    }
    assert extract_public_parameters(header, "MMG3D") == {
        "MMG3D_DPARAM_example",
        "MMG3D_IPARAM_example",
    }


def test_checked_in_coverage_matches_pinned_mmg_headers() -> None:
    """Every pinned public MMG callable has one current classification."""
    mmg_source = find_mmg_source(_REPO_ROOT)
    assert read_mmg_source_version(mmg_source) == read_pinned_mmg_version(_REPO_ROOT)
    document = (_REPO_ROOT / "docs" / "reference" / "mmg-api-coverage.md").read_text(
        encoding="utf-8"
    )
    audits = build_audits(
        mmg_source=mmg_source,
        bindings_dir=_REPO_ROOT / "src" / "bindings",
        document=document,
    )

    errors = [f"{audit.library}: {error}" for audit in audits for error in audit.errors]
    errors.extend(validate_summary(document, audits))
    errors.extend(
        validate_parameter_coverage(mmg_source, _REPO_ROOT / "src" / "bindings")
    )
    assert not errors, "\n".join(errors)
