"""Build a standalone editor from the current Blender translation catalog."""

from __future__ import annotations

import argparse
import ast
import csv
import hashlib
import json
import webbrowser
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from collections.abc import Callable

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = Path(__file__).with_name("translation_editor.html")
KINDS = ("Control", "Button", "Heading", "Choice", "Label", "Message", "Tooltip")


def _message_kinds() -> dict[str, str]:
    """Return display contexts inferred from the add-on's UI declarations."""
    found: dict[str, set[str]] = {}

    def add(node: ast.AST, kind: str) -> None:
        if isinstance(node, ast.Constant) and isinstance(node.value, str):
            found.setdefault(node.value, set()).add(kind)

    for name in ("operators", "panels", "preferences", "properties"):
        tree = ast.parse(
            (ROOT / "blender_mmgpy" / f"{name}.py").read_text(encoding="utf-8")
        )
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name) and target.id == "bl_label":
                        add(node.value, "Heading" if name == "panels" else "Button")
                    if isinstance(target, ast.Name) and target.id == "bl_description":
                        add(node.value, "Tooltip")
            if isinstance(node, ast.Call):
                _call_kinds(node, add)
    return {
        text: next(kind for kind in KINDS if kind in kinds)
        for text, kinds in found.items()
    }


def _call_kinds(node: ast.Call, add: Callable[[ast.AST, str], None]) -> None:
    """Collect property, layout, enum, and formatted-message contexts."""
    function = node.func
    if isinstance(function, ast.Name) and function.id in {"iface_", "rpt_"}:
        add(node.args[0], "Message" if function.id == "rpt_" else "Label")
    for keyword in node.keywords:
        if keyword.arg == "description":
            add(keyword.value, "Tooltip")
        elif keyword.arg in {"name", "title", "confirm_text"}:
            add(keyword.value, "Control" if keyword.arg == "name" else "Heading")
        elif keyword.arg == "text":
            kinds = {"prop": "Control", "operator": "Button"}
            add(keyword.value, kinds.get(getattr(function, "attr", ""), "Label"))
        elif keyword.arg == "items" and isinstance(keyword.value, ast.List):
            for item in keyword.value.elts:
                add(item.elts[1], "Choice")
                add(item.elts[2], "Tooltip")


def build_editor(catalog: Path, output: Path) -> Path:
    """Build an offline editor with the current CSV embedded.

    Returns
    -------
    Path
        The generated HTML file.

    """
    with catalog.open(encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        columns = reader.fieldnames
    kinds = _message_kinds()
    data = {
        "columns": columns,
        "rows": rows,
        "kinds": kinds,
        "source": str(catalog.resolve()),
        "revision": hashlib.sha256(catalog.read_bytes()).hexdigest(),
    }
    # Keep imported text inside its JSON script element, even if it contains HTML.
    embedded = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c")
    html = TEMPLATE.read_text(encoding="utf-8").replace("__CATALOG_DATA__", embedded)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(html, encoding="utf-8")
    return output.resolve()


def main() -> None:
    """Generate the editor, optionally opening it in the default browser."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--catalog", type=Path, default=ROOT / "blender_mmgpy/translations.csv"
    )
    parser.add_argument(
        "--output", type=Path, default=ROOT / "build/translation-editor.html"
    )
    parser.add_argument(
        "--open", action="store_true", help="Open the editor in your browser"
    )
    args = parser.parse_args()
    output = build_editor(args.catalog, args.output)
    print(output)
    if args.open:
        webbrowser.open(output.as_uri())


if __name__ == "__main__":
    main()
