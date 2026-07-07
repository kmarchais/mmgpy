# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Tests for exporting Blender extension stats into docs JSON."""

from __future__ import annotations

from scripts.export_blender_extension_stats import build_payload
from scripts.track_downloads import (
    EVENTS_GIST_FILENAME,
    GIST_FILENAME,
    REVIEWS_GIST_FILENAME,
)


def test_build_payload_converts_csvs_and_merges_live_reviews() -> None:
    """Convert gist CSVs to typed JSON rows and enrich review text."""
    payload = build_payload(
        {
            GIST_FILENAME: (
                "date,downloads,reviews,rating,current_version,updated_at,"
                "compatibility,platforms,package_sizes\n"
                "2026-06-19,1887,2,5.0,0.16.2,2026-05-23T15:22:00Z,"
                "Blender 4.2 LTS and newer,Windows; Linux,Windows=9.1 MB\n"
            ),
            REVIEWS_GIST_FILENAME: (
                "review_id,date,reviewed_at,score,version,author,body\n"
                '7828,2026-06-19,"June 19, 2026, 7:02 p.m.",5,v0.16.2,,\n'
            ),
            EVENTS_GIST_FILENAME: (
                "date,type,label,version,value,source_url\n"
                "2026-06-19,review,5-star review for v0.16.2,v0.16.2,5,"
                "https://extensions.blender.org/add-ons/mmgpy/reviews/\n"
            ),
        },
        live_reviews=[
            {
                "review_id": "7828",
                "date": "2026-06-19",
                "reviewed_at": "June 19, 2026, 7:02 p.m.",
                "score": 5,
                "version": "v0.16.2",
                "author": "cheteron",
                "body": "The addon is great.",
                "source_url": (
                    "https://extensions.blender.org/add-ons/mmgpy/reviews/#review-7828"
                ),
            },
        ],
        generated_at="2026-07-07T10:00:00Z",
    )

    assert payload["generated_at"] == "2026-07-07T10:00:00Z"
    assert payload["daily"][0]["downloads"] == 1887
    assert payload["daily"][0]["rating"] == 5.0
    assert payload["reviews"][0]["author"] == "cheteron"
    assert payload["reviews"][0]["body"] == "The addon is great."
    assert payload["events"][0]["type"] == "review"


def test_build_payload_uses_live_daily_fallback() -> None:
    """Use the live one-row fallback when the gist history is unavailable."""
    payload = build_payload(
        {},
        live_daily=[
            {
                "date": "2026-07-07",
                "downloads": 2100,
                "reviews": 2,
                "rating": 5.0,
            },
        ],
        generated_at="2026-07-07T10:00:00Z",
    )

    assert payload["daily"] == [
        {
            "date": "2026-07-07",
            "downloads": 2100,
            "reviews": 2,
            "rating": 5.0,
        },
    ]
