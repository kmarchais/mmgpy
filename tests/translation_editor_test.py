"""Check that the standalone editor embeds the catalog safely and completely."""

import csv
import json
import runpy
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EDITOR = runpy.run_path(str(ROOT / "scripts/translation_editor.py"))


class _Scripts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.count = 0

    def handle_starttag(self, tag, _attrs):
        if tag == "script":
            self.count += 1


def test_editor_preserves_catalog_and_escapes_html(tmp_path):
    """Quotes, newlines, Unicode, and closing tags survive without script injection."""
    source = ROOT / "blender_mmgpy/translations.csv"
    with source.open(encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        columns = reader.fieldnames
    text = 'Русский, العربية, 日本語\n"quoted" </script><script>alert(1)</script>'
    rows[0]["fr_FR"] = text
    catalog = tmp_path / "translations.csv"
    with catalog.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    output = EDITOR["build_editor"](catalog, tmp_path / "nested/editor.html")
    html = output.read_text(encoding="utf-8")
    embedded = html.split('<script id="catalog-data" type="application/json">', 1)[1]
    data = json.loads(embedded.split("</script>", 1)[0])
    assert data["rows"] == rows
    assert data["columns"] == columns
    assert "__CATALOG_DATA__" not in html
    parser = _Scripts()
    parser.feed(html)
    assert parser.count == 2


def test_editor_distinguishes_controls_and_tooltips():
    """Length guidance uses the UI role instead of treating every string as a label."""
    kinds = EDITOR["_message_kinds"]()
    assert kinds["Uniform Size"] == "Control"
    assert kinds["Remesh"] == "Button"
    assert kinds["Size Control"] == "Heading"
    assert kinds["Minimum edge size (hmin)"] == "Tooltip"
    assert kinds["Failed to convert mesh: {error}"] == "Message"
