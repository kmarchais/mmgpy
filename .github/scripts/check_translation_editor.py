"""Exercise the generated translation editor in a real browser.

Run through ``uv run --no-project --with playwright python``. On Windows the
check uses installed Edge; elsewhere install Playwright's Chromium first.
"""

# Standalone browser integration checks use assertions and print their result.
# ruff: file-ignore[assert]

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> None:
    """Exercise editing, length warnings, CSV round trips, and draft recovery."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", type=Path)
    parser.add_argument(
        "--channel", default="msedge" if sys.platform == "win32" else None
    )
    parser.add_argument("--artifacts", type=Path, required=True)
    args = parser.parse_args()
    args.artifacts.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel=args.channel, headless=True)
        context = browser.new_context(
            accept_downloads=True, viewport={"width": 1100, "height": 960}
        )
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        # Test the portable download path without interactive native file pickers.
        page.add_init_script(
            "window.showSaveFilePicker = undefined; "
            "window.showOpenFilePicker = undefined;"
        )
        page.goto(args.html.resolve().as_uri())
        print("Editor opened", flush=True)
        assert page.locator("#language option").count() == 15
        assert page.locator(".entry").count() == 151
        _check_editing(page)
        _check_csv_and_drafts(page, args.artifacts)
        _check_save_as(page)
        _check_file_safety(page)
        _check_lengths_and_layout(page, args.artifacts)
        assert not errors, errors
        browser.close()
    print(
        "PASS: editing, placeholders, CSV quoting, draft/backup recovery, "
        "RTL, length warnings, and responsive layout"
    )


def _select(page: object, english: str) -> None:
    """Select one English message through the search control."""
    page.locator("#filter").select_option("all")
    page.locator("#search").fill(english)
    page.locator(".entry").filter(
        has=page.locator(".english", has_text=english)
    ).first.click()


def _check_editing(page: object) -> None:
    """Invalid templates block export, and editing invalidates review markers."""
    _select(page, "Vertices: {count:,}")
    page.locator("#translation").fill("Sommets : {count}")
    assert page.locator("#validation").is_visible()
    page.locator("#save-csv").click()
    assert "Fix invalid" in page.locator("#notice").inner_text()
    page.locator("#translation").fill("Sommets vérifiés : {count:,}")
    assert not page.locator("#validation").is_visible()
    page.locator("#filter").select_option("all")
    page.locator("#reviewed").check()
    assert "1 / 151" in page.locator("#review-count").inner_text()
    page.locator("#translation").fill("Sommets modifiés : {count:,}")
    assert not page.locator("#reviewed").is_checked()
    page.locator("#search").fill("no matching source text")
    page.keyboard.press("Control+Enter")
    assert page.locator("#empty-editor").is_visible()


def _check_csv_and_drafts(page: object, artifacts: Path) -> None:
    """Export quoted Unicode text and restore draft and review backup state."""
    _select(page, "Object: {name}")
    edited = 'Objet "test", première ligne\ndeuxième ligne : {name}'
    page.locator("#translation").fill(edited)
    page.locator("#reviewed").check()
    with page.expect_download() as pending:
        page.locator("#save-csv").click()
    saved = artifacts / "editor-export.csv"
    pending.value.save_as(saved)
    with saved.open(encoding="utf-8", newline="") as file:
        catalog = list(csv.DictReader(file))
    assert (
        next(row for row in catalog if row["en_US"] == "Object: {name}")["fr_FR"]
        == edited
    )
    page.reload()
    assert page.locator("#translation").input_value() == edited
    assert page.locator("#reviewed").is_checked()
    with page.expect_download() as pending:
        page.locator("#export-review").click()
    backup = artifacts / "editor-review.json"
    pending.value.save_as(backup)
    assert json.loads(backup.read_text(encoding="utf-8"))["version"] == 1
    page.locator("#translation").fill("Autre nom : {name}")
    page.locator("#review-input").set_input_files(backup)
    assert page.locator("#translation").input_value() == edited
    # Opening another catalog must reset against that file, not the embedded CSV.
    page.locator("#csv-input").set_input_files(saved)
    _select(page, "Object: {name}")
    page.locator("#translation").fill("À réinitialiser : {name}")
    page.locator("#reset-entry").click()
    assert page.locator("#translation").input_value() == edited
    # Invalid imports must leave the current work intact.
    page.locator("#csv-input").set_input_files({
        "name": "bad.csv",
        "mimeType": "text/csv",
        "buffer": b"en_US,fr_FR\nwrong,incorrect\n",
    })
    assert page.locator("#notice.error").is_visible()
    assert page.locator("#translation").input_value() == edited
    # Re-exporting uses the same semantic CSV structure after imports.
    parsed = page.evaluate("parseCsv(toCsv(rows))")
    assert parsed == catalog


def _check_lengths_and_layout(page: object, artifacts: Path) -> None:
    """Long controls warn without blocking review, and Arabic uses RTL editing."""
    page.locator("#language").select_option("de_DE")
    _select(page, "Uniform Size")
    page.locator("#translation").fill(
        "Eine besonders lange Bezeichnung für die einheitliche Größe"
    )
    page.locator("#panel-width").fill("180")
    page.locator("#panel-width").dispatch_event("input")
    assert page.locator("#length-warning").is_visible()
    assert not page.locator("#review-next").is_disabled()
    assert page.locator("#preview-label").evaluate(
        "el => el.scrollWidth > el.clientWidth"
    )
    page.screenshot(path=str(artifacts / "editor-desktop.png"), full_page=True)
    page.locator("#language").select_option("ar_EG")
    assert page.locator("#translation").get_attribute("dir") == "rtl"
    page.set_viewport_size({"width": 390, "height": 844})
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    page.screenshot(path=str(artifacts / "editor-mobile.png"), full_page=True)
    # Values are inserted as text, never as markup.
    page.locator("#translation").fill(
        '<img src=x onerror="window.editorInjected=true">'
    )
    assert page.evaluate("window.editorInjected !== true")


def _check_file_safety(page: object) -> None:
    """Exercise native file API writes and reject a catalog changed elsewhere."""
    page.evaluate("""() => {
        window.fakeDisk = toCsv(rows);
        window.fakeWritten = null;
        window.showOpenFilePicker = async () => [{
            getFile: async () => new File([window.fakeDisk], 'translations.csv'),
            createWritable: async () => ({
                write: async value => { window.fakeWritten = value; },
                close: async () => { window.fakeDisk = window.fakeWritten; },
                abort: async () => { window.fakeWritten = null; }
            })
        }];
    }""")
    page.once("dialog", lambda dialog: dialog.accept())
    page.locator("#open-csv").click()
    _select(page, "Uniform Size")
    page.locator("#translation").fill("Taille uniforme vérifiée")
    page.evaluate("window.fakeDisk += '\\n'")
    page.locator("#save-csv").click()
    assert "changed on disk" in page.locator("#notice").inner_text()
    assert page.evaluate("window.fakeWritten === null")
    page.evaluate("window.fakeDisk = diskText")
    page.locator("#save-csv").click()
    assert "CSV saved" in page.locator("#notice").inner_text()
    assert "Taille uniforme vérifiée" in page.evaluate("window.fakeWritten")


def _check_save_as(page: object) -> None:
    """Protect an existing, different catalog on the first save too."""
    page.evaluate("""() => {
        fileHandle = null;
        const newer = structuredClone(rows);
        newer[0].fr_FR += ' changed elsewhere';
        window.saveAsDisk = toCsv(newer);
        window.saveAsWritten = null;
        window.showSaveFilePicker = async () => ({
            getFile: async () => new File([window.saveAsDisk], 'translations.csv'),
            createWritable: async () => ({
                write: async value => { window.saveAsWritten = value; },
                close: async () => { window.saveAsDisk = window.saveAsWritten; },
                abort: async () => { window.saveAsWritten = null; }
            })
        });
    }""")
    for _ in range(2):
        page.locator("#save-csv").click()
        assert "differs from the catalog" in page.locator("#notice").inner_text()
        assert page.evaluate("window.saveAsWritten === null")
    page.evaluate("window.saveAsDisk = toCsv(baseline)")
    page.locator("#save-csv").click()
    assert "CSV saved" in page.locator("#notice").inner_text()
    assert page.evaluate("window.saveAsWritten === toCsv(rows)")


if __name__ == "__main__":
    main()
