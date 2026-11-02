# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Exercise the add-on's translations in Blender, including language switches.

Run with Blender's ``--background --factory-startup --python-exit-code 1
--python`` options. Pass ``-- --site-packages PATH`` to use an unpacked mmgpy
wheel matching Blender's Python version without changing the user's install.
"""

# This is a standalone integration test, including the panel's internal helper.
# ruff: file-ignore[assert, private-member-access]

from __future__ import annotations

import argparse
import importlib
import sys
from pathlib import Path
from types import SimpleNamespace

import bpy


def main() -> None:
    """Check registration, every translation, preferences, and clean teardown."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site-packages", type=Path)
    args = parser.parse_args(
        sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    )
    if args.site_packages:
        sys.path.insert(0, str(args.site_packages))
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    addon = importlib.import_module("blender_mmgpy")
    translations = importlib.import_module("blender_mmgpy.translations")
    registration = importlib.import_module("blender_mmgpy._register")
    panels = importlib.import_module("blender_mmgpy.panels")
    prefs = bpy.context.preferences.view
    addon.register()
    try:
        _check_rna(registration.classes, translations.CONTEXT)
        _check_languages(translations, panels, prefs)
    finally:
        addon.unregister()
    assert not hasattr(bpy.types.Scene, "mmgpy"), "Scene settings survived unregister"
    assert translations.iface_("Size Control") == "Size Control"
    # A second enable/disable cycle catches stale registration state.
    addon.register()
    addon.unregister()
    print("PASS: all locales, RNA contexts, preferences, fallback, and re-registration")


def _check_rna(classes: tuple, context: str) -> None:
    """Check the actual registered class and property translation contexts."""
    for cls in classes:
        if issubclass(cls, (bpy.types.Panel, bpy.types.Operator)):
            assert cls.bl_rna.translation_context == context, cls.__name__
        rna = cls.bl_rna
        if issubclass(cls, bpy.types.Operator):
            module, name = cls.bl_idname.split(".")
            rna = getattr(getattr(bpy.ops, module), name).get_rna_type()
        for name in cls.__annotations__:
            if name.startswith("bl_"):
                continue
            prop = rna.properties[name]
            assert prop.translation_context == context, (cls.__name__, name)


def _check_languages(translations: object, panels: object, prefs: object) -> None:
    """Look up the whole catalog through Blender's real translation functions."""
    for locale, catalog in translations.TRANSLATIONS.items():
        prefs.language = locale
        prefs.use_translate_interface = True
        prefs.use_translate_tooltips = True
        prefs.use_translate_reports = True
        for (context, english), expected in catalog.items():
            assert bpy.app.translations.pgettext(english, context) == expected, (
                locale,
                english,
            )
            assert translations.iface_(english) == expected, (locale, english)
            assert translations.rpt_(english) == expected, (locale, english)
            assert bpy.app.translations.pgettext_tip(english, context) == expected, (
                locale,
                english,
            )
        labels = panels._quality_axis_labels(
            SimpleNamespace(quality_colormap_mode="AUTO"),
            {"min": 0.2, "max": 0.9},
        )
        assert labels[0] == catalog[context, "{value:.2f} — poor"].format(value=0.2)
        assert labels[1] == catalog[context, "best — {value:.2f}"].format(value=0.9)
        assert translations.iface_("Unknown MMGpy message") == "Unknown MMGpy message"
        # Our custom context must not override Blender's default-context labels.
        assert bpy.app.translations.pgettext("Size Control", "*") == "Size Control"
        prefs.use_translate_interface = False
        assert translations.iface_("Size Control") == "Size Control"
        prefs.use_translate_reports = False
        assert translations.rpt_("Mesh has zero size") == "Mesh has zero size"
        # Reports and interface translations have independent preferences.
        prefs.use_translate_reports = True
        assert (
            translations.rpt_("Mesh has zero size")
            == catalog[context, "Mesh has zero size"]
        )
        print(f"PASS: {locale}: {len(catalog)} translated messages")
    prefs.language = "en_US"
    prefs.use_translate_interface = True
    assert translations.iface_("Size Control") == "Size Control"
    prefs.language = "nl_NL"
    assert translations.iface_("Size Control") == "Size Control"
    prefs.language = "fr_FR"
    assert translations.iface_("Size Control") == "Contrôle de la taille"


if __name__ == "__main__":
    main()
