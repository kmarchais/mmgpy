# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Export Blender extension marketplace stats for the static docs site."""

from __future__ import annotations

import csv
import io
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.track_downloads import (  # noqa: E402
    EVENTS_GIST_FILENAME,
    EXTENSION_URL,
    GIST_FILENAME,
    HTTP_TIMEOUT,
    REVIEWS_GIST_FILENAME,
    REVIEWS_URL,
    ReviewEvent,
    fetch_extension_stats,
    fetch_review_events,
)

OUTPUT_PATH = Path("docs/assets/data/blender-extension-stats.json")
GIST_FILENAMES = (GIST_FILENAME, REVIEWS_GIST_FILENAME, EVENTS_GIST_FILENAME)
NETWORK_ERRORS = (
    OSError,
    RuntimeError,
    urllib.error.URLError,
    json.JSONDecodeError,
    KeyError,
    ValueError,
)


def utc_now() -> str:
    """Return the current UTC timestamp in compact ISO-8601 form."""
    now = datetime.now(timezone.utc)
    return now.isoformat(timespec="seconds").replace("+00:00", "Z")


def _csv_rows(content: str) -> list[dict[str, str]]:
    if not content.strip():
        return []
    return list(csv.DictReader(io.StringIO(content)))


def _int_or_none(value: str | None) -> int | None:
    if not value:
        return None
    return int(value)


def _float_or_none(value: str | None) -> float | None:
    if not value:
        return None
    return float(value)


def daily_rows(content: str) -> list[dict[str, Any]]:
    """Convert the tracker's daily CSV into JSON-friendly rows."""
    rows: list[dict[str, Any]] = []
    for row in _csv_rows(content):
        date = row.get("date", "")
        downloads = _int_or_none(row.get("downloads"))
        if not date or downloads is None:
            continue
        rows.append(
            {
                "date": date,
                "downloads": downloads,
                "reviews": _int_or_none(row.get("reviews")),
                "rating": _float_or_none(row.get("rating")),
                "current_version": row.get("current_version", ""),
                "updated_at": row.get("updated_at", ""),
                "compatibility": row.get("compatibility", ""),
                "platforms": row.get("platforms", ""),
                "package_sizes": row.get("package_sizes", ""),
            },
        )
    return sorted(rows, key=lambda item: item["date"])


def review_event_row(event: ReviewEvent) -> dict[str, Any]:
    """Convert a scraped review event into a JSON-friendly row."""
    return {
        "review_id": event.review_id,
        "date": event.date,
        "reviewed_at": event.reviewed_at,
        "score": event.score,
        "version": event.version,
        "author": event.author,
        "body": event.body,
        "source_url": f"{REVIEWS_URL}#review-{event.review_id}",
    }


def review_rows(content: str) -> list[dict[str, Any]]:
    """Convert the tracker's review CSV into JSON-friendly rows."""
    rows: list[dict[str, Any]] = []
    for row in _csv_rows(content):
        review_id = row.get("review_id", "")
        date = row.get("date", "")
        score = _int_or_none(row.get("score"))
        if not review_id or not date or score is None:
            continue
        rows.append(
            {
                "review_id": review_id,
                "date": date,
                "reviewed_at": row.get("reviewed_at", ""),
                "score": score,
                "version": row.get("version", ""),
                "author": row.get("author", ""),
                "body": row.get("body", ""),
                "source_url": f"{REVIEWS_URL}#review-{review_id}",
            },
        )
    return sorted(rows, key=lambda item: (item["date"], item["review_id"]))


def event_rows(content: str) -> list[dict[str, str]]:
    """Convert generated plot-marker CSV rows into JSON-friendly rows."""
    fields = ("date", "type", "label", "version", "value", "source_url")
    rows = [
        {field: row.get(field, "") for field in fields}
        for row in _csv_rows(content)
        if row.get("date") and row.get("type")
    ]
    return sorted(rows, key=lambda item: (item["date"], item["type"], item["label"]))


def merge_review_rows(
    stored_rows: list[dict[str, Any]],
    live_rows: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Merge live review text into stored review rows by review id."""
    rows_by_id = {row["review_id"]: row for row in stored_rows}
    for live_row in live_rows:
        stored = rows_by_id.get(live_row["review_id"], {})
        rows_by_id[live_row["review_id"]] = {**stored, **live_row}
    return sorted(
        rows_by_id.values(), key=lambda item: (item["date"], item["review_id"])
    )


def fetch_gist_files() -> dict[str, str]:
    """Fetch tracked CSV files from the configured GitHub Gist."""
    gist_id = os.environ.get("GIST_ID", "").strip()
    if not gist_id:
        return {}

    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "mmgpy-docs-stats-export",
    }
    token = os.environ.get("GIST_TOKEN", "").strip()
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(
        f"https://api.github.com/gists/{gist_id}",
        headers=headers,
    )
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:  # noqa: S310
        gist = json.loads(resp.read())

    files = gist["files"]
    return {
        filename: files[filename]["content"]
        for filename in GIST_FILENAMES
        if filename in files
    }


def fetch_live_daily_rows() -> list[dict[str, Any]]:
    """Fetch the current detail-page stats as a one-row fallback."""
    stats = fetch_extension_stats()
    today = datetime.now(timezone.utc).date().isoformat()
    return [
        {
            "date": today,
            "downloads": stats.downloads,
            "reviews": stats.reviews,
            "rating": stats.rating,
            "current_version": stats.current_version,
            "updated_at": stats.updated_at,
            "compatibility": stats.compatibility,
            "platforms": stats.platforms,
            "package_sizes": stats.package_sizes,
        },
    ]


def fetch_live_review_rows() -> list[dict[str, Any]]:
    """Fetch current public review cards from extensions.blender.org."""
    return [review_event_row(event) for event in fetch_review_events()]


def build_payload(
    gist_files: dict[str, str],
    *,
    live_daily: list[dict[str, Any]] | None = None,
    live_reviews: list[dict[str, Any]] | None = None,
    generated_at: str | None = None,
) -> dict[str, Any]:
    """Build the JSON payload consumed by the docs page."""
    daily = daily_rows(gist_files.get(GIST_FILENAME, ""))
    reviews = review_rows(gist_files.get(REVIEWS_GIST_FILENAME, ""))
    if not daily and live_daily:
        daily = live_daily
    if live_reviews:
        reviews = merge_review_rows(reviews, live_reviews)

    return {
        "generated_at": generated_at or utc_now(),
        "source_url": EXTENSION_URL,
        "reviews_url": REVIEWS_URL,
        "daily": daily,
        "reviews": reviews,
        "events": event_rows(gist_files.get(EVENTS_GIST_FILENAME, "")),
    }


def write_payload(payload: dict[str, Any], output_path: Path = OUTPUT_PATH) -> None:
    """Write the docs stats JSON payload."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main() -> int:
    """Export the stats asset without making docs builds depend on the tracker."""
    try:
        gist_files = fetch_gist_files()
    except NETWORK_ERRORS as exc:
        print(f"warning: could not fetch Blender extension stats gist: {exc}")
        gist_files = {}

    live_daily: list[dict[str, Any]] = []
    if not gist_files.get(GIST_FILENAME):
        try:
            live_daily = fetch_live_daily_rows()
        except NETWORK_ERRORS as exc:
            print(f"warning: could not fetch live Blender extension stats: {exc}")

    try:
        live_reviews = fetch_live_review_rows()
    except NETWORK_ERRORS as exc:
        print(f"warning: could not fetch live Blender extension reviews: {exc}")
        live_reviews = []

    payload = build_payload(
        gist_files,
        live_daily=live_daily,
        live_reviews=live_reviews,
    )
    write_payload(payload)
    print(
        f"wrote {OUTPUT_PATH} with {len(payload['daily'])} daily rows "
        f"and {len(payload['reviews'])} reviews",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
