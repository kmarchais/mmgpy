"""Keep generated language pages current and translation diffs readable."""

import csv
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEW = runpy.run_path(str(ROOT / "scripts/translation_review.py"))


def test_review_pages_match_catalog():
    """Every locale has a current English-to-translation document."""
    with (ROOT / "blender_mmgpy/translations.csv").open(encoding="utf-8") as stream:
        rows = list(csv.DictReader(stream))
    assert set(rows[0]) - {"en_US"} == set(REVIEW["LANGUAGES"])
    for name, content in REVIEW["review_pages"](rows).items():
        assert (ROOT / "docs/translations" / name).read_text(
            encoding="utf-8"
        ) == content


def test_review_escapes_text_and_highlights_only_changes():
    """Markup, pipes and newlines remain text; only changed entries are bold."""
    source = "<script>x</script> | *label*\nnext"
    base = [{"en_US": source, "ru_RU": "Старый"}, {"en_US": "Same", "ru_RU": "Тот же"}]
    rows = [{"en_US": source, "ru_RU": "Новый"}, base[1]]
    table = REVIEW["pr_table"](rows, base, "ru_RU")
    assert "<script>" not in table
    assert "&lt;script&gt;x&lt;/script&gt; &#124; &#42;label&#42;<br>next" in table
    assert "**Новый**<br><del>Старый</del>" in table
    assert "| Same | Тот же |" in table
    assert table.count("**") == 4
    locale_rows = [{"en_US": source, **dict.fromkeys(REVIEW["LANGUAGES"], "نص")}]
    arabic = REVIEW["review_pages"](locale_rows)["ar_EG.md"]
    assert '<span lang="ar-EG" dir="rtl">نص</span>' in arabic
