"""Check translation coverage without requiring Blender or the native extension."""

import ast
import csv
from pathlib import Path
from string import Formatter

import pytest

ADDON = Path(__file__).resolve().parents[1] / "blender_mmgpy"
LOCALES = {
    "fr_FR",
    "ru_RU",
    "es",
    "de_DE",
    "it_IT",
    "ar_EG",
    "zh_HANS",
    "zh_HANT",
    "ja_JP",
    "ko_KR",
    "pt_BR",
    "pt_PT",
    "pl_PL",
    "uk_UA",
    "tr_TR",
}


def _call_messages(node):
    """Collect messages from a call and reject interpolation before translation."""
    messages = set()
    if isinstance(node.func, ast.Name) and node.func.id in {"iface_", "rpt_"}:
        assert isinstance(node.args[0], ast.Constant)
        messages.add(node.args[0].value)
    keywords = {kw.arg: kw.value for kw in node.keywords}
    for key in ("text", "name", "description", "title", "confirm_text"):
        value = keywords.get(key)
        if isinstance(value, ast.Constant) and isinstance(value.value, str):
            messages.add(value.value)
    if "items" in keywords:
        for item in keywords["items"].elts:
            messages.update(value.value for value in item.elts[1:3])
    for key in ("text", "message"):
        assert not isinstance(keywords.get(key), ast.JoinedStr)
    if isinstance(node.func, ast.Attribute) and node.func.attr == "report":
        assert any(
            isinstance(child, ast.Call)
            and isinstance(child.func, ast.Name)
            and child.func.id == "rpt_"
            for child in ast.walk(node.args[1])
        )
    return messages


def _ui_messages():
    """Collect RNA labels, tooltips, enum choices, and explicit message templates."""
    messages = set()
    for name in ("operators", "panels", "preferences", "properties"):
        tree = ast.parse((ADDON / f"{name}.py").read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                names = {t.id for t in node.targets if isinstance(t, ast.Name)}
                if names & {"bl_label", "bl_description"}:
                    messages.add(node.value.value)
            if isinstance(node, ast.Call):
                messages.update(_call_messages(node))
    return messages - {""}


def _catalog_rows():
    with (ADDON / "translations.csv").open(encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        assert set(reader.fieldnames) == LOCALES | {"en_US"}
        return list(reader)


def test_translation_coverage():
    """Every UI string has exactly one row, including dynamically formatted text."""
    rows = _catalog_rows()
    english = [row["en_US"] for row in rows]
    assert len(english) == len(set(english)), "Duplicate English messages"
    assert set(english) == _ui_messages()


@pytest.mark.parametrize("locale", sorted(LOCALES))
def test_translation_placeholders(locale):
    """All locales are complete and preserve field names, specs, and conversions."""
    formatter = Formatter()
    for row in _catalog_rows():
        assert None not in row, f"Extra CSV columns: {row['en_US']}"
        translated = row[locale]
        assert translated, row["en_US"]
        assert translated.strip() == translated, row["en_US"]
        original_fields = {
            (field, spec, conversion)
            for _, field, spec, conversion in formatter.parse(row["en_US"])
            if field is not None
        }
        translated_fields = {
            (field, spec, conversion)
            for _, field, spec, conversion in formatter.parse(translated)
            if field is not None
        }
        assert original_fields == translated_fields, row["en_US"]
        # Exercise actual formatting, including numeric specs and braces.
        translated.format(**{
            field: (1234.567 if spec else "test") for field, spec, _ in original_fields
        })


def test_release_packages_translations():
    """The immutable-source fetch and zip allowlists both include the catalogs."""
    workflow = (
        ADDON.parent / ".github/workflows/build-blender-extension.yml"
    ).read_text(encoding="utf-8")
    for name in ("translations.py", "translations.csv"):
        assert f"'{name}'" in workflow, f"Missing source fetch: {name}"
        assert f'"{name}"' in workflow, f"Missing packaged file: {name}"


def test_ui_translation_contexts():
    """Static labels and properties must use the same isolated context as the CSV."""
    for name in ("operators", "panels", "preferences", "properties"):
        tree = ast.parse((ADDON / f"{name}.py").read_text(encoding="utf-8"))
        for node in ast.walk(tree):
            if not isinstance(node, ast.Call):
                continue
            keywords = {kw.arg: kw.value for kw in node.keywords}
            if (
                isinstance(node.func, ast.Name)
                and node.func.id.endswith("Property")
                and "name" in keywords
            ):
                assert ast.unparse(keywords["translation_context"]) == "CONTEXT"
            text = keywords.get("text")
            if isinstance(text, ast.Constant) and text.value:
                assert ast.unparse(keywords["text_ctxt"]) == "CONTEXT"
