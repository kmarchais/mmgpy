# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Track daily stats for the mmgpy Blender extension.

Scrapes the cumulative download count, rating, review count, public review
events, extension version history, and GitHub release events. The official
Blender Extensions JSON API does not include these public site stats, so the
tracker reads the HTML rendered on the extension pages.

Daily stats are written to a secret GitHub Gist as ``mmgpy_downloads.csv``.
Older two-column ``date,downloads`` history is preserved; new rows use
``date,downloads,reviews,rating,current_version,updated_at,compatibility,
platforms,package_sizes``. Event CSVs are maintained separately so plots can
mark exact dates instead of only daily state changes.

Designed to run from a GitHub Actions cron. Requires two environment
variables:

- ``GIST_ID``    gist id (last path segment of the gist URL)
- ``GIST_TOKEN`` PAT with the ``gist`` scope (read+write on that gist)

Reruns on the same UTC date are idempotent: if the gist already contains the
current values, the script exits successfully without modifying the gist.
"""

from __future__ import annotations

import csv
import html
import io
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, replace
from datetime import datetime, timezone
from typing import Any

EXTENSION_SLUG = "mmgpy"
EXTENSION_URL = f"https://extensions.blender.org/add-ons/{EXTENSION_SLUG}/"
REVIEWS_URL = f"{EXTENSION_URL}reviews/"
VERSIONS_URL = f"{EXTENSION_URL}versions/"
GITHUB_RELEASES_URL = "https://api.github.com/repos/kmarchais/mmgpy/releases"
GITHUB_COMMITS_URL = "https://api.github.com/repos/kmarchais/mmgpy/commits"
GIST_FILENAME = "mmgpy_downloads.csv"
REVIEWS_GIST_FILENAME = "mmgpy_reviews.csv"
VERSIONS_GIST_FILENAME = "mmgpy_versions.csv"
GITHUB_RELEASES_GIST_FILENAME = "mmgpy_github_releases.csv"
GITHUB_DOCS_GIST_FILENAME = "mmgpy_github_docs.csv"
EVENTS_GIST_FILENAME = "mmgpy_events.csv"
DOWNLOADS_PATTERN = re.compile(
    rb"<dt>\s*Downloads\s*</dt>\s*<dd>\s*([\d,]+)\s*</dd>",
    re.DOTALL,
)
RATING_PATTERN = re.compile(
    rb"<dt>\s*Rating\s*</dt>\s*<dd>.*?"
    rb'title="Rated ([\d.]+) out of 5".*?\((\d+)\).*?</dd>',
    re.DOTALL,
)
REVIEW_ARTICLE_PATTERN = re.compile(
    rb'<article id="review-(\d+)".*?</article>',
    re.DOTALL,
)
REVIEW_AUTHOR_PATTERN = re.compile(
    rb"<header>.*?<a href=\"/reviews-by/\d+/\">\s*([^<]+)\s*</a>",
    re.DOTALL,
)
REVIEW_BODY_PATTERN = re.compile(
    rb'<div class="comment-card-content">\s*(.*?)\s*</div>',
    re.DOTALL,
)
REVIEW_SCORE_PATTERN = re.compile(rb'title="Rated (\d+) out of 5"')
REVIEW_VERSION_PATTERN = re.compile(
    rb'href="/add-ons/mmgpy/versions/#[^"]+">\s*([^<]+)\s*</a>',
)
REVIEW_DATE_PATTERN = re.compile(rb'href="#review-\d+"\s+title="([^"]+)"')
VERSION_DETAILS_PATTERN = re.compile(
    rb'<details[^>]*id="v\d+"[^>]*>.*?</details>',
    re.DOTALL,
)
VERSION_NUMBER_PATTERN = re.compile(rb"<summary>\s*([0-9.]+)")
VERSION_DATE_PATTERN = re.compile(rb'href="#v\d+"\s+title="([^"]+)"')
VERSION_STATUS_PATTERN = re.compile(
    rb"<dt>\s*Status\s*</dt>.*?<span[^>]*title=\"([^\"]+)\"",
    re.DOTALL,
)
GITHUB_DOCS_PATHS = ("/docs/", "/mkdocs.yml", "/README.md", "/CHANGELOG.md")
HTTP_TIMEOUT = 30


@dataclass(frozen=True)
class ExtensionStats:
    """Public extension stats captured from the detail page."""

    downloads: int
    reviews: int
    rating: float | None
    current_version: str = ""
    updated_at: str = ""
    compatibility: str = ""
    platforms: str = ""
    package_sizes: str = ""


@dataclass(frozen=True)
class ReviewEvent:
    """A public review event suitable for annotating download plots."""

    review_id: str
    date: str
    reviewed_at: str
    score: int
    version: str
    author: str = ""
    body: str = ""


@dataclass(frozen=True)
class VersionEvent:
    """A Blender Extensions version-history event."""

    version: str
    date: str
    published_at: str
    downloads: int
    compatibility: str
    platforms: str
    package_sizes: str
    status: str


@dataclass(frozen=True)
class GitHubReleaseEvent:
    """A GitHub release event."""

    tag: str
    date: str
    published_at: str
    name: str
    url: str


@dataclass(frozen=True)
class GitHubDocsEvent:
    """A GitHub commit touching public docs or release notes."""

    sha: str
    date: str
    committed_at: str
    path: str
    message: str
    url: str


@dataclass(frozen=True)
class PlotEvent:
    """A plot marker event row."""

    date: str
    type: str
    label: str
    version: str = ""
    value: str = ""
    source_url: str = ""

    def as_row(self) -> dict[str, str]:
        """Return this event as a CSV row."""
        return {
            "date": self.date,
            "type": self.type,
            "label": self.label,
            "version": self.version,
            "value": self.value,
            "source_url": self.source_url,
        }


@dataclass(frozen=True)
class TrackerSnapshot:
    """All public sources captured during one tracker run."""

    stats: ExtensionStats
    reviews: list[ReviewEvent]
    versions: list[VersionEvent]
    github_releases: list[GitHubReleaseEvent]
    github_docs: list[GitHubDocsEvent]


@dataclass(frozen=True)
class EventSources:
    """Source data used to generate plot marker rows."""

    daily_csv: str
    reviews: list[ReviewEvent]
    versions: list[VersionEvent]
    github_releases: list[GitHubReleaseEvent]
    github_docs: list[GitHubDocsEvent]


def fetch_url(url: str) -> bytes:
    """Fetch a public Blender Extensions page."""
    req = urllib.request.Request(  # noqa: S310
        url,
        headers={
            "User-Agent": (
                "mmgpy-download-tracker (+https://github.com/kmarchais/mmgpy)"
            ),
        },
    )
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:  # noqa: S310
        return resp.read()


def _decode(value: bytes) -> str:
    return html.unescape(value.decode("utf-8")).strip()


def _text_from_html(body: bytes) -> str:
    text = re.sub(rb"<[^>]+>", b" ", body)
    return re.sub(r"\s+", " ", _decode(text)).strip()


def _normalize_date_title(value: str) -> str:
    return re.sub(r"(\d+)(?:s[t]|n[d]|r[d]|t[h])", r"\1", value)


def _parse_review_date(value: str) -> str:
    normalized = (
        value
        .replace("a.m.", "AM")
        .replace("p.m.", "PM")
        .replace("a.m", "AM")
        .replace("p.m", "PM")
    )
    parsed = datetime.strptime(normalized, "%B %d, %Y, %I:%M %p").replace(
        tzinfo=timezone.utc,
    )
    return parsed.date().isoformat()


def _parse_version_datetime(value: str) -> tuple[str, str]:
    normalized = _normalize_date_title(value)
    parsed = datetime.strptime(normalized, "%A %d, %B %Y - %H:%M").replace(
        tzinfo=timezone.utc,
    )
    return parsed.date().isoformat(), parsed.isoformat().replace("+00:00", "Z")


def _parse_compatibility(body: bytes) -> str:
    match = re.search(
        rb"<dt>\s*Compatibility.*?</dt>\s*<dd>(.*?)</dd>",
        body,
        re.DOTALL,
    )
    return _text_from_html(match.group(1)) if match else ""


def _parse_platforms(body: bytes) -> str:
    platforms: list[str] = []
    if b"i-windows" in body:
        platforms.append("Windows")
    if b"i-macos" in body:
        platforms.append("macOS Apple Silicon")
    if b"i-linux" in body:
        platforms.append("Linux")
    return "; ".join(platforms)


def _parse_package_sizes(body: bytes) -> str:
    sizes: list[str] = []
    download_links = re.findall(
        rb'<a [^>]*download="[^"]+"[^>]*class="[^"]*btn[^"]*"[^>]*>(.*?)</a>',
        body,
        re.DOTALL,
    )
    for link in download_links:
        text = _text_from_html(link)
        size_match = re.search(r"(\d+(?:\.\d+)?\s*[KMGT]B)", text)
        if size_match is None:
            continue
        size = size_match.group(1).replace("\xa0", " ")
        if "Windows" in text:
            sizes.append(f"Windows={size}")
        elif "macOS" in text:
            sizes.append(f"macOS Apple Silicon={size}")
        elif "Linux" in text:
            sizes.append(f"Linux={size}")
        else:
            sizes.append(f"all={size}")

    if sizes:
        return "; ".join(dict.fromkeys(sizes))

    size_match = re.search(rb"<dt>\s*Size\s*</dt>\s*<dd>\s*([^<]+)\s*</dd>", body)
    if size_match:
        size = _decode(size_match.group(1)).replace("\xa0", " ")
        return f"all={size}"
    return ""


def _parse_current_version(body: bytes) -> str:
    match = re.search(
        rb"<dt>\s*Version\s*</dt>\s*<dd>.*?([0-9]+\.[0-9]+\.[0-9]+).*?</dd>",
        body,
        re.DOTALL,
    )
    return _decode(match.group(1)) if match else ""


def _parse_updated_at(body: bytes) -> str:
    match = re.search(
        rb"<dt>\s*Updated\s*</dt>\s*<dd\s+title=\"([^\"]+)\"",
        body,
        re.DOTALL,
    )
    if match is None:
        return ""
    _, updated_at = _parse_version_datetime(_decode(match.group(1)))
    return updated_at


def parse_extension_stats(body: bytes) -> ExtensionStats:
    """Parse cumulative stats from the extension detail page."""
    downloads_match = DOWNLOADS_PATTERN.search(body)
    if downloads_match is None:
        msg = f"no Downloads field found on {EXTENSION_URL} - markup may have changed"
        raise RuntimeError(msg)
    downloads = int(downloads_match.group(1).replace(b",", b""))

    rating_match = RATING_PATTERN.search(body)
    if rating_match is None:
        return ExtensionStats(
            downloads=downloads,
            reviews=0,
            rating=None,
            current_version=_parse_current_version(body),
            updated_at=_parse_updated_at(body),
            compatibility=_parse_compatibility(body),
            platforms=_parse_platforms(body),
            package_sizes=_parse_package_sizes(body),
        )

    return ExtensionStats(
        downloads=downloads,
        reviews=int(rating_match.group(2)),
        rating=float(rating_match.group(1)),
        current_version=_parse_current_version(body),
        updated_at=_parse_updated_at(body),
        compatibility=_parse_compatibility(body),
        platforms=_parse_platforms(body),
        package_sizes=_parse_package_sizes(body),
    )


def parse_review_events(body: bytes) -> list[ReviewEvent]:
    """Parse review events from the public reviews page."""
    events: list[ReviewEvent] = []
    for article_match in REVIEW_ARTICLE_PATTERN.finditer(body):
        article = article_match.group(0)
        date_match = REVIEW_DATE_PATTERN.search(article)
        score_match = REVIEW_SCORE_PATTERN.search(article)
        version_match = REVIEW_VERSION_PATTERN.search(article)
        author_match = REVIEW_AUTHOR_PATTERN.search(article)
        body_match = REVIEW_BODY_PATTERN.search(article)
        if date_match is None or score_match is None or version_match is None:
            msg = "review article markup did not contain date, score, and version"
            raise RuntimeError(msg)
        reviewed_at = _decode(date_match.group(1))
        events.append(
            ReviewEvent(
                review_id=_decode(article_match.group(1)),
                date=_parse_review_date(reviewed_at),
                reviewed_at=reviewed_at,
                score=int(score_match.group(1)),
                version=_decode(version_match.group(1)),
                author=_decode(author_match.group(1)) if author_match else "",
                body=_text_from_html(body_match.group(1)) if body_match else "",
            ),
        )
    return events


def parse_version_events(body: bytes) -> list[VersionEvent]:
    """Parse Blender Extensions version-history cards."""
    events: list[VersionEvent] = []
    for details_match in VERSION_DETAILS_PATTERN.finditer(body):
        details = details_match.group(0)
        version_match = VERSION_NUMBER_PATTERN.search(details)
        date_match = VERSION_DATE_PATTERN.search(details)
        downloads_match = DOWNLOADS_PATTERN.search(details)
        if version_match is None or date_match is None or downloads_match is None:
            msg = "version card markup did not contain version, date, and downloads"
            raise RuntimeError(msg)

        date, published_at = _parse_version_datetime(_decode(date_match.group(1)))
        status_match = VERSION_STATUS_PATTERN.search(details)
        events.append(
            VersionEvent(
                version=_decode(version_match.group(1)),
                date=date,
                published_at=published_at,
                downloads=int(downloads_match.group(1).replace(b",", b"")),
                compatibility=_parse_compatibility(details),
                platforms=_parse_platforms(details),
                package_sizes=_parse_package_sizes(details),
                status=_decode(status_match.group(1)) if status_match else "",
            ),
        )
    return events


def parse_github_releases(body: bytes) -> list[GitHubReleaseEvent]:
    """Parse GitHub releases API JSON."""
    releases = json.loads(body)
    events: list[GitHubReleaseEvent] = []
    for release in releases:
        published_at = release.get("published_at") or ""
        if not published_at:
            continue
        events.append(
            GitHubReleaseEvent(
                tag=release["tag_name"],
                date=published_at[:10],
                published_at=published_at,
                name=release.get("name") or release["tag_name"],
                url=release["html_url"],
            ),
        )
    return events


def parse_github_docs_commits(body: bytes, path: str) -> list[GitHubDocsEvent]:
    """Parse GitHub commits API JSON for one docs-related path."""
    commits = json.loads(body)
    events: list[GitHubDocsEvent] = []
    for item in commits:
        commit = item.get("commit", {})
        committed_at = commit.get("committer", {}).get("date") or ""
        if not committed_at:
            continue
        message = (commit.get("message") or "").splitlines()[0]
        events.append(
            GitHubDocsEvent(
                sha=item["sha"],
                date=committed_at[:10],
                committed_at=committed_at,
                path=path,
                message=message,
                url=item["html_url"],
            ),
        )
    return events


def enrich_stats_from_versions(
    stats: ExtensionStats,
    version_events: list[VersionEvent],
) -> ExtensionStats:
    """Fill daily state fields from the matching version-history row."""
    current = next(
        (
            event
            for event in version_events
            if stats.current_version in {event.version, f"v{event.version}"}
        ),
        None,
    )
    if current is None:
        return stats
    return replace(
        stats,
        compatibility=stats.compatibility or current.compatibility,
        platforms=stats.platforms or current.platforms,
        package_sizes=stats.package_sizes or current.package_sizes,
    )


def fetch_extension_stats() -> ExtensionStats:
    """Return the current public extension stats."""
    return parse_extension_stats(fetch_url(EXTENSION_URL))


def fetch_review_events() -> list[ReviewEvent]:
    """Return currently visible public review events."""
    return parse_review_events(fetch_url(REVIEWS_URL))


def fetch_version_events() -> list[VersionEvent]:
    """Return Blender Extensions version-history events."""
    return parse_version_events(fetch_url(VERSIONS_URL))


def fetch_github_releases() -> list[GitHubReleaseEvent]:
    """Return GitHub release events."""
    return parse_github_releases(fetch_url(GITHUB_RELEASES_URL))


def fetch_github_docs_events() -> list[GitHubDocsEvent]:
    """Return recent GitHub commits touching docs-related paths."""
    events_by_key: dict[tuple[str, str], GitHubDocsEvent] = {}
    for path in GITHUB_DOCS_PATHS:
        url = f"{GITHUB_COMMITS_URL}?path={urllib.parse.quote(path)}&per_page=25"
        for event in parse_github_docs_commits(fetch_url(url), path):
            events_by_key[event.sha, event.path] = event
    return sorted(events_by_key.values(), key=lambda event: event.committed_at)


def _csv_rows(content: str) -> list[dict[str, str]]:
    if not content.strip():
        return []
    return list(csv.DictReader(io.StringIO(content)))


def _write_csv(fieldnames: list[str], rows: list[dict[str, str]]) -> str:
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return output.getvalue()


def _review_summary_for_date(
    date: str,
    review_events: list[ReviewEvent],
) -> tuple[str, str]:
    dated_reviews = [event for event in review_events if event.date <= date]
    if not dated_reviews:
        return "0", ""
    rating = sum(event.score for event in dated_reviews) / len(dated_reviews)
    return str(len(dated_reviews)), f"{rating:.1f}"


def _version_for_date(
    date: str,
    version_events: list[VersionEvent],
) -> VersionEvent | None:
    candidates = [event for event in version_events if event.date <= date]
    if not candidates:
        return None
    return max(candidates, key=lambda event: event.published_at)


def _csv_review_events(content: str) -> list[ReviewEvent]:
    return [
        ReviewEvent(
            review_id=row.get("review_id", ""),
            date=row.get("date", ""),
            reviewed_at=row.get("reviewed_at", ""),
            score=int(row.get("score", "0")),
            version=row.get("version", ""),
            author=row.get("author", ""),
            body=row.get("body", ""),
        )
        for row in _csv_rows(content)
        if row.get("review_id") and row.get("date") and row.get("score")
    ]


def update_daily_csv(
    content: str,
    date: str,
    stats: ExtensionStats,
    review_events: list[ReviewEvent] | None = None,
    version_events: list[VersionEvent] | None = None,
) -> tuple[str, bool]:
    """Add or update the row for a UTC date."""
    review_events = review_events or []
    version_events = version_events or []
    fields = [
        "date",
        "downloads",
        "reviews",
        "rating",
        "current_version",
        "updated_at",
        "compatibility",
        "platforms",
        "package_sizes",
    ]
    rows = []
    today_row = {
        "date": date,
        "downloads": str(stats.downloads),
        "reviews": str(stats.reviews),
        "rating": "" if stats.rating is None else f"{stats.rating:.1f}",
        "current_version": stats.current_version,
        "updated_at": stats.updated_at,
        "compatibility": stats.compatibility,
        "platforms": stats.platforms,
        "package_sizes": stats.package_sizes,
    }
    found = False
    for row in _csv_rows(content):
        normalized = {field: row.get(field, "") for field in fields}
        if normalized["date"] == date:
            normalized = today_row
            found = True
        else:
            if review_events:
                reviews, rating = _review_summary_for_date(
                    normalized["date"],
                    review_events,
                )
                normalized["reviews"] = reviews
                normalized["rating"] = rating
            version = _version_for_date(normalized["date"], version_events)
            if version is not None:
                normalized["current_version"] = version.version
                normalized["updated_at"] = version.published_at
                normalized["compatibility"] = version.compatibility
                normalized["platforms"] = version.platforms
                normalized["package_sizes"] = version.package_sizes
        rows.append(normalized)
    if not found:
        rows.append(today_row)
    updated = _write_csv(fields, rows)
    return updated, updated != content


def update_reviews_csv(
    content: str,
    review_events: list[ReviewEvent],
) -> tuple[str, bool]:
    """Merge currently visible public review events into the review-event CSV."""
    fields = ["review_id", "date", "reviewed_at", "score", "version", "author", "body"]
    rows_by_id = {
        row["review_id"]: {field: row.get(field, "") for field in fields}
        for row in _csv_rows(content)
        if row.get("review_id")
    }
    for event in review_events:
        rows_by_id[event.review_id] = {
            "review_id": event.review_id,
            "date": event.date,
            "reviewed_at": event.reviewed_at,
            "score": str(event.score),
            "version": event.version,
            "author": event.author,
            "body": event.body,
        }

    rows = sorted(
        rows_by_id.values(),
        key=lambda row: (row["date"], int(row["review_id"])),
    )
    updated = _write_csv(fields, rows)
    return updated, updated != content


def update_versions_csv(
    content: str,
    version_events: list[VersionEvent],
) -> tuple[str, bool]:
    """Merge Blender Extensions version-history events into the versions CSV."""
    fields = [
        "version",
        "date",
        "published_at",
        "downloads",
        "compatibility",
        "platforms",
        "package_sizes",
        "status",
    ]
    rows_by_version = {
        row["version"]: {field: row.get(field, "") for field in fields}
        for row in _csv_rows(content)
        if row.get("version")
    }
    for event in version_events:
        rows_by_version[event.version] = {
            "version": event.version,
            "date": event.date,
            "published_at": event.published_at,
            "downloads": str(event.downloads),
            "compatibility": event.compatibility,
            "platforms": event.platforms,
            "package_sizes": event.package_sizes,
            "status": event.status,
        }
    rows = sorted(rows_by_version.values(), key=lambda row: row["published_at"])
    updated = _write_csv(fields, rows)
    return updated, updated != content


def update_github_releases_csv(
    content: str,
    github_releases: list[GitHubReleaseEvent],
) -> tuple[str, bool]:
    """Merge GitHub release events into the GitHub releases CSV."""
    fields = ["tag", "date", "published_at", "name", "url"]
    rows_by_tag = {
        row["tag"]: {field: row.get(field, "") for field in fields}
        for row in _csv_rows(content)
        if row.get("tag")
    }
    for event in github_releases:
        rows_by_tag[event.tag] = {
            "tag": event.tag,
            "date": event.date,
            "published_at": event.published_at,
            "name": event.name,
            "url": event.url,
        }
    rows = sorted(rows_by_tag.values(), key=lambda row: row["published_at"])
    updated = _write_csv(fields, rows)
    return updated, updated != content


def update_github_docs_csv(
    content: str,
    github_docs: list[GitHubDocsEvent],
) -> tuple[str, bool]:
    """Merge GitHub docs/release-note commit events into the docs CSV."""
    fields = ["sha", "date", "committed_at", "path", "message", "url"]
    rows_by_key = {
        (row["sha"], row["path"]): {field: row.get(field, "") for field in fields}
        for row in _csv_rows(content)
        if row.get("sha") and row.get("path")
    }
    for event in github_docs:
        rows_by_key[event.sha, event.path] = {
            "sha": event.sha,
            "date": event.date,
            "committed_at": event.committed_at,
            "path": event.path,
            "message": event.message,
            "url": event.url,
        }
    rows = sorted(rows_by_key.values(), key=lambda row: row["committed_at"])
    updated = _write_csv(fields, rows)
    return updated, updated != content


def _rating_change_events(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    events: list[dict[str, str]] = []
    previous_rating = ""
    for row in sorted(rows, key=lambda item: item.get("date", "")):
        rating = row.get("rating", "")
        if not rating:
            continue
        if previous_rating and rating != previous_rating:
            events.append(
                PlotEvent(
                    date=row["date"],
                    type="rating_change",
                    label=f"Rating changed {previous_rating} -> {rating}",
                    version=row.get("current_version", ""),
                    value=rating,
                    source_url=REVIEWS_URL,
                ).as_row(),
            )
        previous_rating = rating
    return events


def generated_event_rows(
    daily_csv: str,
    review_events: list[ReviewEvent],
    version_events: list[VersionEvent],
    github_releases: list[GitHubReleaseEvent],
    github_docs: list[GitHubDocsEvent],
) -> list[dict[str, str]]:
    """Build plot-marker rows from all tracked sources."""
    first_extension_date = min((event.date for event in version_events), default="")
    rows = [
        PlotEvent(
            date=event.date,
            type="review",
            label=f"{event.score}-star review for {event.version}",
            version=event.version,
            value=str(event.score),
            source_url=REVIEWS_URL,
        ).as_row()
        for event in review_events
    ]

    sorted_versions = sorted(version_events, key=lambda event: event.published_at)
    previous_version: VersionEvent | None = None
    for event in sorted_versions:
        rows.append(
            PlotEvent(
                date=event.date,
                type="version_release",
                label=f"Blender extension v{event.version}",
                version=event.version,
                value=str(event.downloads),
                source_url=VERSIONS_URL,
            ).as_row(),
        )
        if previous_version is not None and (
            event.compatibility != previous_version.compatibility
        ):
            rows.append(
                PlotEvent(
                    date=event.date,
                    type="compatibility_change",
                    label=f"Compatibility changed to {event.compatibility}",
                    version=event.version,
                    value=event.compatibility,
                    source_url=VERSIONS_URL,
                ).as_row(),
            )
        if previous_version is not None and (
            event.platforms != previous_version.platforms
            or event.package_sizes != previous_version.package_sizes
        ):
            rows.append(
                PlotEvent(
                    date=event.date,
                    type="platform_package_change",
                    label="Platform/package metadata changed",
                    version=event.version,
                    value=f"{event.platforms}; {event.package_sizes}".strip("; "),
                    source_url=VERSIONS_URL,
                ).as_row(),
            )
        previous_version = event

    rows.extend(
        PlotEvent(
            date=event.date,
            type="github_release",
            label=f"GitHub release {event.tag}",
            version=event.tag,
            value=event.name,
            source_url=event.url,
        ).as_row()
        for event in github_releases
        if not first_extension_date or event.date >= first_extension_date
    )
    rows.extend(
        PlotEvent(
            date=event.date,
            type="github_docs",
            label=f"Docs update: {event.message}",
            value=event.path,
            source_url=event.url,
        ).as_row()
        for event in github_docs
        if not first_extension_date or event.date >= first_extension_date
    )

    rows.extend(_rating_change_events(_csv_rows(daily_csv)))
    return rows


def update_events_csv(
    content: str,
    sources: EventSources,
) -> tuple[str, bool]:
    """Merge generated marker events while preserving manual event rows."""
    fields = ["date", "type", "label", "version", "value", "source_url"]
    rows = [
        {field: row.get(field, "") for field in fields}
        for row in _csv_rows(content)
        if row.get("date") and row.get("type")
    ]
    rows.extend(
        generated_event_rows(
            sources.daily_csv,
            sources.reviews,
            sources.versions,
            sources.github_releases,
            sources.github_docs,
        ),
    )

    unique_rows = {tuple(row[field] for field in fields): row for row in rows}
    updated_rows = sorted(
        unique_rows.values(),
        key=lambda row: (row["date"], row["type"], row["version"], row["label"]),
    )
    updated = _write_csv(fields, updated_rows)
    return updated, updated != content


def _gist_file_content(gist: dict[str, Any], filename: str) -> str:
    if filename not in gist["files"]:
        if filename in {
            REVIEWS_GIST_FILENAME,
            VERSIONS_GIST_FILENAME,
            GITHUB_RELEASES_GIST_FILENAME,
            GITHUB_DOCS_GIST_FILENAME,
            EVENTS_GIST_FILENAME,
        }:
            return ""
        msg = f"gist {os.environ['GIST_ID']} has no file named {filename!r}"
        raise RuntimeError(msg)
    return gist["files"][filename]["content"]


def build_gist_file_updates(
    gist: dict[str, Any],
    today: str,
    snapshot: TrackerSnapshot,
) -> dict[str, dict[str, str]]:
    """Build changed gist file payloads."""
    reviews_csv, reviews_changed = update_reviews_csv(
        _gist_file_content(gist, REVIEWS_GIST_FILENAME),
        snapshot.reviews,
    )
    review_events = _csv_review_events(reviews_csv)
    update_inputs = [
        (
            GIST_FILENAME,
            update_daily_csv(
                _gist_file_content(gist, GIST_FILENAME),
                today,
                snapshot.stats,
                review_events,
                snapshot.versions,
            ),
        ),
        (REVIEWS_GIST_FILENAME, (reviews_csv, reviews_changed)),
        (
            VERSIONS_GIST_FILENAME,
            update_versions_csv(
                _gist_file_content(gist, VERSIONS_GIST_FILENAME),
                snapshot.versions,
            ),
        ),
        (
            GITHUB_RELEASES_GIST_FILENAME,
            update_github_releases_csv(
                _gist_file_content(gist, GITHUB_RELEASES_GIST_FILENAME),
                snapshot.github_releases,
            ),
        ),
        (
            GITHUB_DOCS_GIST_FILENAME,
            update_github_docs_csv(
                _gist_file_content(gist, GITHUB_DOCS_GIST_FILENAME),
                snapshot.github_docs,
            ),
        ),
    ]
    content_by_name = {
        filename: content for filename, (content, _changed) in update_inputs
    }
    events_csv, events_changed = update_events_csv(
        _gist_file_content(gist, EVENTS_GIST_FILENAME),
        EventSources(
            daily_csv=content_by_name[GIST_FILENAME],
            reviews=snapshot.reviews,
            versions=snapshot.versions,
            github_releases=snapshot.github_releases,
            github_docs=snapshot.github_docs,
        ),
    )
    update_inputs.append((EVENTS_GIST_FILENAME, (events_csv, events_changed)))

    return {
        filename: {"content": content}
        for filename, (content, changed) in update_inputs
        if changed
    }


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
    """Fetch current stats and update gist CSV files."""
    gist_id = os.environ["GIST_ID"]
    token = os.environ["GIST_TOKEN"]

    today = datetime.now(timezone.utc).date().isoformat()
    version_events = fetch_version_events()
    snapshot = TrackerSnapshot(
        stats=enrich_stats_from_versions(fetch_extension_stats(), version_events),
        reviews=fetch_review_events(),
        versions=version_events,
        github_releases=fetch_github_releases(),
        github_docs=fetch_github_docs_events(),
    )
    print(
        f"{today}: {snapshot.stats.downloads} downloads, "
        f"{snapshot.stats.reviews} reviews, "
        f"rating {snapshot.stats.rating or 'n/a'}, "
        f"version {snapshot.stats.current_version or 'n/a'}"
    )

    gist = gist_request(gist_id, token, "GET")
    files = build_gist_file_updates(gist, today, snapshot)
    if not files:
        print("gist already up to date; nothing to do")
        return 0

    gist_request(
        gist_id,
        token,
        "PATCH",
        {"files": files},
    )
    print(f"updated {', '.join(files)}")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except urllib.error.HTTPError as exc:
        print(f"HTTP {exc.code}: {exc.reason}", file=sys.stderr)
        sys.exit(1)
