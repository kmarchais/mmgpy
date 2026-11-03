"""Generate English-to-language review pages and a translation PR table."""

from __future__ import annotations

import argparse
import csv
import html
import io
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = "blender_mmgpy/translations.csv"
LANGUAGES = {
    "fr_FR": "French · Français",
    "ru_RU": "Russian · Русский",
    "es": "Spanish · Español",
    "de_DE": "German · Deutsch",
    "it_IT": "Italian · Italiano",
    "ar_EG": "Arabic · العربية",
    "zh_HANS": "Simplified Chinese · 简体中文",
    "zh_HANT": "Traditional Chinese · 繁體中文",
    "ja_JP": "Japanese · 日本語",
    "ko_KR": "Korean · 한국어",
    "pt_BR": "Brazilian Portuguese · Português do Brasil",
    "pt_PT": "European Portuguese · Português de Portugal",
    "pl_PL": "Polish · Polski",
    "uk_UA": "Ukrainian · Українська",
    "tr_TR": "Turkish · Türkçe",
}


def cell(text: str) -> str:
    """Escape HTML and Markdown while preserving line breaks in table cells."""
    escaped = html.escape(text)
    for char in "\\`*_[]|~":
        escaped = escaped.replace(char, f"&#{ord(char)};")
    return escaped.replace("\n", "<br>")


def review_pages(rows: list[dict[str, str]]) -> dict[str, str]:
    """Return one review page per locale and a linked index."""
    pages = {}
    index = [
        "# Blender translation review",
        "",
        (
            "Each page compares every English message with one language. "
            "These pages are generated from `blender_mmgpy/translations.csv`."
        ),
        "",
        (
            "Edit translations with the offline editor described in the "
            "[extension README](https://github.com/kmarchais/mmgpy/blob/main/"
            "blender_mmgpy/README.md#update-a-translation). "
            "Then regenerate these pages:"
        ),
        "",
        "```bash",
        "uv run --no-project python scripts/translation_review.py",
        "```",
        "",
    ]
    for locale, name in LANGUAGES.items():
        tag = locale.replace("_", "-")
        direction = ' dir="rtl"' if locale == "ar_EG" else ""
        lines = [
            f"# {name}",
            "",
            "[All languages](index.md)",
            "",
            (
                f"Locale: `{locale}`. Generated from `blender_mmgpy/translations.csv`. "
                "Edit the catalog, then run `python scripts/translation_review.py`."
            ),
            "",
            "<!-- prettier-ignore -->",
            "| English | Translation |",
            "| --- | --- |",
        ]
        lines.extend(
            f'| {cell(row["en_US"])} | <span lang="{tag}"{direction}>'
            f"{cell(row[locale])}</span> |"
            for row in rows
        )
        pages[f"{locale}.md"] = "\n".join(lines) + "\n"
        index.append(f"- [{name}]({locale}.md)")
    pages["index.md"] = "\n".join(index) + "\n"
    return pages


def pr_table(
    rows: list[dict[str, str]], base: list[dict[str, str]], locale: str
) -> str:
    """Show all translations, with bold changes and struck-through old wording."""
    previous = {row["en_US"]: row[locale] for row in base}
    lines = [
        "| English | " + LANGUAGES[locale].split(" · ")[0] + " |",
        "| --- | --- |",
    ]
    for row in rows:
        english, translated = row["en_US"], row[locale]
        source, target = cell(english), cell(translated)
        if previous.get(english) != translated:
            source, target = f"**{source}**", f"**{target}**"
            if english in previous:
                target += f"<br><del>{cell(previous[english])}</del>"
        lines.append(f"| {source} | {target} |")
    return "\n".join(lines) + "\n"


def main() -> None:
    """Write review pages and, optionally, a PR description against a Git ref."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-ref", help="Git ref used to highlight PR changes")
    parser.add_argument("--pr-body", type=Path, help="Write the PR table to this file")
    parser.add_argument("--locale", choices=LANGUAGES, default="ru_RU")
    args = parser.parse_args()
    if bool(args.base_ref) != bool(args.pr_body):
        parser.error("--base-ref and --pr-body must be used together")
    with (ROOT / CATALOG).open(encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))
    output = ROOT / "docs/translations"
    output.mkdir(parents=True, exist_ok=True)
    for name, content in review_pages(rows).items():
        (output / name).write_text(content, encoding="utf-8", newline="\n")
    if args.pr_body:
        git = shutil.which("git")
        if git is None:
            parser.error("Git is required to compare translations against a base ref")
        source = subprocess.check_output(
            [git, "show", f"{args.base_ref}:{CATALOG}"],
            cwd=ROOT,
        ).decode("utf-8")
        base = list(csv.DictReader(io.StringIO(source)))
        args.pr_body.parent.mkdir(parents=True, exist_ok=True)
        args.pr_body.write_text(pr_table(rows, base, args.locale), encoding="utf-8")


if __name__ == "__main__":
    main()
