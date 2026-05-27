# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Track daily download count of the mmgpy Blender extension.

Scrapes the cumulative download count from
``https://extensions.blender.org/search/?q=mmgpy`` (the count is exposed
in a ``title="N downloads"`` attribute on the listing card; the official
JSON API does not include it) and appends a ``date,downloads`` row to a
secret GitHub Gist storing the historical series.

Designed to run from a GitHub Actions cron. Requires two environment
variables:

- ``GIST_ID``    gist id (last path segment of the gist URL)
- ``GIST_TOKEN`` PAT with the ``gist`` scope (read+write on that gist)

Reruns on the same UTC date are idempotent: if a row for today is
already present, the script exits successfully without modifying the
gist.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from typing import Any

EXTENSION_SLUG = "mmgpy"
LISTING_URL = f"https://extensions.blender.org/search/?q={EXTENSION_SLUG}"
GIST_FILENAME = "mmgpy_downloads.csv"
COUNT_PATTERN = re.compile(rb'title="(\d+) downloads"')
HTTP_TIMEOUT = 30


def fetch_download_count() -> int:
    """Return the current cumulative download count from the listing page."""
    req = urllib.request.Request(
        LISTING_URL,
        headers={
            "User-Agent": "mmgpy-download-tracker (+https://github.com/kmarchais/mmgpy)",
        },
    )
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:  # noqa: S310
        body = resp.read()
    matches = COUNT_PATTERN.findall(body)
    if not matches:
        msg = (
            f"no 'title=\"N downloads\"' match on {LISTING_URL} - "
            "listing markup may have changed"
        )
        raise RuntimeError(msg)
    return int(matches[0])


def gist_request(
    gist_id: str,
    token: str,
    method: str,
    payload: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Call the GitHub Gists API and return the parsed JSON response."""
    data = json.dumps(payload).encode() if payload is not None else None
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "mmgpy-download-tracker",
    }
    if data:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(
        f"https://api.github.com/gists/{gist_id}",
        data=data,
        method=method,
        headers=headers,
    )
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:  # noqa: S310
        return json.loads(resp.read())


def main() -> int:
    """Fetch the count and append it to the gist CSV (idempotent per UTC day)."""
    gist_id = os.environ["GIST_ID"]
    token = os.environ["GIST_TOKEN"]

    today = datetime.now(timezone.utc).date().isoformat()
    count = fetch_download_count()
    print(f"{today}: {count} downloads")

    gist = gist_request(gist_id, token, "GET")
    if GIST_FILENAME not in gist["files"]:
        msg = f"gist {gist_id} has no file named {GIST_FILENAME!r}"
        raise RuntimeError(msg)
    current = gist["files"][GIST_FILENAME]["content"]

    if any(line.startswith(f"{today},") for line in current.splitlines()):
        print(f"row for {today} already present; nothing to do")
        return 0

    updated = current.rstrip("\n") + f"\n{today},{count}\n"
    gist_request(
        gist_id,
        token,
        "PATCH",
        {"files": {GIST_FILENAME: {"content": updated}}},
    )
    print(f"appended {today},{count}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except urllib.error.HTTPError as exc:
        print(f"HTTP {exc.code}: {exc.reason}", file=sys.stderr)
        sys.exit(1)
