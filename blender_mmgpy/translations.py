# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Blender translation catalogs, stored as one CSV row per English message."""

import csv
from pathlib import Path

import bpy

CONTEXT = "MMGpy"

with Path(__file__).with_suffix(".csv").open(encoding="utf-8", newline="") as _file:
    _reader = csv.DictReader(_file)
    TRANSLATIONS = {locale: {} for locale in _reader.fieldnames if locale != "en_US"}
    for _row in _reader:
        for _locale, _catalog in TRANSLATIONS.items():
            if _row[_locale]:
                _catalog[CONTEXT, _row["en_US"]] = _row[_locale]


def iface_(message: str) -> str:
    """Translate a UI template before inserting dynamic values.

    Returns
    -------
    str
        The translation, or the English template when translation is disabled.

    """
    return bpy.app.translations.pgettext_iface(message, CONTEXT)


def rpt_(message: str) -> str:
    """Translate a report template using Blender's report preference.

    Returns
    -------
    str
        The translation, or the English template when translation is disabled.

    """
    return bpy.app.translations.pgettext_rpt(message, CONTEXT)
