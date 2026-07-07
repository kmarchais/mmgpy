# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Tests for Blender extension stats tracking."""

from __future__ import annotations

from scripts.track_downloads import (
    EventSources,
    ExtensionStats,
    GitHubDocsEvent,
    GitHubReleaseEvent,
    ReviewEvent,
    VersionEvent,
    enrich_stats_from_versions,
    generated_event_rows,
    parse_extension_stats,
    parse_github_docs_commits,
    parse_github_releases,
    parse_review_events,
    parse_version_events,
    update_daily_csv,
    update_events_csv,
    update_github_docs_csv,
    update_github_releases_csv,
    update_reviews_csv,
    update_versions_csv,
)


def test_parse_extension_stats_with_reviews() -> None:
    """Parse downloads, review count, and rating from detail-page HTML."""
    html = b"""
    <div class="dl-row">
      <div class="dl-col"><dt>Downloads</dt><dd>1,956</dd></div>
    </div>
    <div class="dl-row">
      <div class="dl-col">
        <dt>Version</dt>
        <dd><a href="/add-ons/mmgpy/versions/">0.16.2</a></dd>
      </div>
    </div>
    <div class="dl-row">
      <div class="dl-col">
        <dt>Updated</dt>
        <dd title="Saturday 23rd, May 2026 - 15:22">3 w</dd>
      </div>
    </div>
    <div class="dl-row">
      <div class="dl-col">
        <dt>Compatibility</dt>
        <dd><a>Blender 4.2 LTS</a> and newer</dd>
      </div>
    </div>
    <li><i class="i-windows"></i> Windows</li>
    <li><i class="i-macos"></i> macOS <span>Apple Silicon</span></li>
    <li><i class="i-linux"></i> Linux</li>
    <a download="add-on-mmgpy-v0.16.2-windows-x64.zip" class="btn">
      <span><i class="i-windows"></i> Windows v0.16.2</span><span>9.1 MB</span>
    </a>
    <div class="dl-row">
      <div class="dl-col">
        <dt>Rating</dt>
        <dd>
          <a href="/add-ons/mmgpy/reviews/">
            <span class="stars" title="Rated 5.0 out of 5"></span>
            (2)
          </a>
        </dd>
      </div>
    </div>
    """

    stats = parse_extension_stats(html)

    assert stats == ExtensionStats(
        downloads=1956,
        reviews=2,
        rating=5.0,
        current_version="0.16.2",
        updated_at="2026-05-23T15:22:00Z",
        compatibility="Blender 4.2 LTS and newer",
        platforms="Windows; macOS Apple Silicon; Linux",
        package_sizes="Windows=9.1 MB",
    )


def test_parse_extension_stats_without_reviews() -> None:
    """Treat an unrated extension as zero reviews with no rating."""
    html = b"<dl><dt>Downloads</dt><dd>127</dd></dl>"

    stats = parse_extension_stats(html)

    assert stats == ExtensionStats(downloads=127, reviews=0, rating=None)


def test_parse_review_events() -> None:
    """Parse exact review dates from review-page article cards."""
    html = b"""
    <article id="review-7828" class="comment-card mb-2">
      <header><a href="/reviews-by/3222/">cheteron</a></header>
      <a class="stars-helper" href="/add-ons/mmgpy/reviews/?score=5">
        <span class="stars me-1 " title="Rated 5 out of 5"></span>
      </a>
      <a href="/add-ons/mmgpy/versions/#v0162">v0.16.2</a>
      <a href="#review-7828" title="June 19, 2026, 7:02 p.m.">15 h</a>
      <div class="comment-card-content">
        <p>The addon is great, but a tutorial video would be helpful.</p>
      </div>
    </article>
    <article id="review-7732" class="comment-card mb-2">
      <header><a href="/reviews-by/2655/">Trantor</a></header>
      <a class="stars-helper" href="/add-ons/mmgpy/reviews/?score=5">
        <span class="stars me-1 " title="Rated 5 out of 5"></span>
      </a>
      <a href="/add-ons/mmgpy/versions/#v0162">v0.16.2</a>
      <a href="#review-7732" title="June 14, 2026, 9:08 a.m.">6 d</a>
      <div class="comment-card-content">
        <p>This is what I need. Thank you!</p>
      </div>
    </article>
    """

    events = parse_review_events(html)

    assert events == [
        ReviewEvent(
            review_id="7828",
            date="2026-06-19",
            reviewed_at="June 19, 2026, 7:02 p.m.",
            score=5,
            version="v0.16.2",
            author="cheteron",
            body="The addon is great, but a tutorial video would be helpful.",
        ),
        ReviewEvent(
            review_id="7732",
            date="2026-06-14",
            reviewed_at="June 14, 2026, 9:08 a.m.",
            score=5,
            version="v0.16.2",
            author="Trantor",
            body="This is what I need. Thank you!",
        ),
    ]


def test_parse_version_events() -> None:
    """Parse Blender Extensions version-history cards."""
    html = b"""
    <details open id="v0162">
      <summary>
        0.16.2
        <a href="#v0162" title="Saturday 23rd, May 2026 - 15:22">
          May 23rd, 2026
        </a>
      </summary>
      <div class="dl-row">
        <div class="dl-col">
          <dt>Compatibility</dt>
          <dd><a>Blender 4.2 LTS</a> and newer</dd>
        </div>
      </div>
      <li><i class="i-macos"></i> macOS <span>Apple Silicon</span></li>
      <li><i class="i-windows"></i> Windows</li>
      <li><i class="i-linux"></i> Linux</li>
      <div class="dl-row">
        <div class="dl-col"><dt>Downloads</dt><dd>1,828</dd></div>
      </div>
      <div class="dl-row">
        <div class="dl-col">
          <dt>Status</dt><dd><span title="Approved"></span></dd>
        </div>
      </div>
      <a download="add-on-mmgpy-v0.16.2-windows-x64.zip" class="btn">
        <span><i class="i-windows"></i> Windows v0.16.2</span><span>9.1 MB</span>
      </a>
      <a download="add-on-mmgpy-v0.16.2-linux-x64.zip" class="btn">
        <span><i class="i-linux"></i> Linux v0.16.2</span><span>18.4 MB</span>
      </a>
    </details>
    """

    events = parse_version_events(html)

    assert events == [
        VersionEvent(
            version="0.16.2",
            date="2026-05-23",
            published_at="2026-05-23T15:22:00Z",
            downloads=1828,
            compatibility="Blender 4.2 LTS and newer",
            platforms="Windows; macOS Apple Silicon; Linux",
            package_sizes="Windows=9.1 MB; Linux=18.4 MB",
            status="Approved",
        ),
    ]


def test_parse_github_releases() -> None:
    """Parse GitHub release API rows."""
    body = b"""
    [
      {
        "tag_name": "v0.16.2",
        "published_at": "2026-05-23T13:11:09Z",
        "name": "v0.16.2",
        "html_url": "https://github.com/kmarchais/mmgpy/releases/tag/v0.16.2"
      }
    ]
    """

    events = parse_github_releases(body)

    assert events == [
        GitHubReleaseEvent(
            tag="v0.16.2",
            date="2026-05-23",
            published_at="2026-05-23T13:11:09Z",
            name="v0.16.2",
            url="https://github.com/kmarchais/mmgpy/releases/tag/v0.16.2",
        ),
    ]


def test_parse_github_docs_commits() -> None:
    """Parse GitHub commits API rows for docs paths."""
    body = b"""
    [
      {
        "sha": "abc123",
        "html_url": "https://github.com/kmarchais/mmgpy/commit/abc123",
        "commit": {
          "message": "Update Blender extension docs\\n\\nDetails",
          "committer": {"date": "2026-06-01T12:30:00Z"}
        }
      }
    ]
    """

    events = parse_github_docs_commits(body, "/docs/")

    assert events == [
        GitHubDocsEvent(
            sha="abc123",
            date="2026-06-01",
            committed_at="2026-06-01T12:30:00Z",
            path="/docs/",
            message="Update Blender extension docs",
            url="https://github.com/kmarchais/mmgpy/commit/abc123",
        ),
    ]


def test_enrich_stats_from_versions_fills_package_sizes() -> None:
    """Fill missing daily package metadata from version history."""
    stats = enrich_stats_from_versions(
        ExtensionStats(
            downloads=1956,
            reviews=2,
            rating=5.0,
            current_version="0.16.2",
        ),
        [
            VersionEvent(
                version="0.16.2",
                date="2026-05-23",
                published_at="2026-05-23T15:22:00Z",
                downloads=1828,
                compatibility="Blender 4.2 LTS and newer",
                platforms="Windows; macOS Apple Silicon; Linux",
                package_sizes="Windows=9.1 MB",
                status="Approved",
            ),
        ],
    )

    assert stats.package_sizes == "Windows=9.1 MB"


def test_update_daily_csv_upgrades_legacy_rows_and_updates_today() -> None:
    """Upgrade the old two-column CSV while updating today's values."""
    content = "date,downloads\n2026-06-19,1887\n"

    updated, changed = update_daily_csv(
        content,
        "2026-06-19",
        ExtensionStats(
            downloads=1956,
            reviews=2,
            rating=5.0,
            current_version="0.16.2",
            updated_at="2026-05-23T15:22:00Z",
            compatibility="Blender 4.2 LTS and newer",
            platforms="Windows; macOS Apple Silicon; Linux",
            package_sizes="Windows=9.1 MB; Linux=18.4 MB",
        ),
    )

    assert changed is True
    assert updated == (
        "date,downloads,reviews,rating,current_version,updated_at,"
        "compatibility,platforms,package_sizes\n"
        "2026-06-19,1956,2,5.0,0.16.2,2026-05-23T15:22:00Z,"
        "Blender 4.2 LTS and newer,Windows; macOS Apple Silicon; Linux,"
        "Windows=9.1 MB; Linux=18.4 MB\n"
    )


def test_update_daily_csv_backfills_review_and_version_history() -> None:
    """Backfill historical daily rows from tracked review and version events."""
    content = (
        "date,downloads,reviews,rating,current_version,updated_at,"
        "compatibility,platforms,package_sizes\n"
        "2026-06-13,1328,,,,,,,\n"
        "2026-06-14,1386,,,,,,,\n"
        "2026-06-18,1776,,,,,,,\n"
        "2026-06-19,1887,,,,,,,\n"
        "2026-06-20,1956,,,,,,,\n"
    )

    updated, changed = update_daily_csv(
        content,
        "2026-06-20",
        ExtensionStats(
            downloads=1956,
            reviews=2,
            rating=5.0,
            current_version="0.16.2",
            updated_at="2026-05-23T15:22:00Z",
            compatibility="Blender 4.2 LTS and newer",
            platforms="Windows; macOS Apple Silicon; Linux",
            package_sizes="Windows=9.1 MB",
        ),
        [
            ReviewEvent(
                review_id="7732",
                date="2026-06-14",
                reviewed_at="June 14, 2026, 9:08 a.m.",
                score=5,
                version="v0.16.2",
            ),
            ReviewEvent(
                review_id="7828",
                date="2026-06-19",
                reviewed_at="June 19, 2026, 7:02 p.m.",
                score=5,
                version="v0.16.2",
            ),
        ],
        [
            VersionEvent(
                version="0.16.2",
                date="2026-05-23",
                published_at="2026-05-23T15:22:00Z",
                downloads=1828,
                compatibility="Blender 4.2 LTS and newer",
                platforms="Windows; macOS Apple Silicon; Linux",
                package_sizes="Windows=9.1 MB",
                status="Approved",
            ),
        ],
    )

    assert changed is True
    assert updated == (
        "date,downloads,reviews,rating,current_version,updated_at,"
        "compatibility,platforms,package_sizes\n"
        "2026-06-13,1328,0,,0.16.2,2026-05-23T15:22:00Z,"
        "Blender 4.2 LTS and newer,Windows; macOS Apple Silicon; Linux,"
        "Windows=9.1 MB\n"
        "2026-06-14,1386,1,5.0,0.16.2,2026-05-23T15:22:00Z,"
        "Blender 4.2 LTS and newer,Windows; macOS Apple Silicon; Linux,"
        "Windows=9.1 MB\n"
        "2026-06-18,1776,1,5.0,0.16.2,2026-05-23T15:22:00Z,"
        "Blender 4.2 LTS and newer,Windows; macOS Apple Silicon; Linux,"
        "Windows=9.1 MB\n"
        "2026-06-19,1887,2,5.0,0.16.2,2026-05-23T15:22:00Z,"
        "Blender 4.2 LTS and newer,Windows; macOS Apple Silicon; Linux,"
        "Windows=9.1 MB\n"
        "2026-06-20,1956,2,5.0,0.16.2,2026-05-23T15:22:00Z,"
        "Blender 4.2 LTS and newer,Windows; macOS Apple Silicon; Linux,"
        "Windows=9.1 MB\n"
    )


def test_update_reviews_csv_merges_by_review_id() -> None:
    """Append newly visible review events without duplicating old ones."""
    content = (
        "review_id,date,reviewed_at,score,version\n"
        '7732,2026-06-14,"June 14, 2026, 9:08 a.m.",5,v0.16.2\n'
    )

    updated, changed = update_reviews_csv(
        content,
        [
            ReviewEvent(
                review_id="7828",
                date="2026-06-19",
                reviewed_at="June 19, 2026, 7:02 p.m.",
                score=5,
                version="v0.16.2",
                author="cheteron",
                body="The addon is great.",
            ),
        ],
    )

    assert changed is True
    assert updated == (
        "review_id,date,reviewed_at,score,version,author,body\n"
        '7732,2026-06-14,"June 14, 2026, 9:08 a.m.",5,v0.16.2,,\n'
        '7828,2026-06-19,"June 19, 2026, 7:02 p.m.",5,v0.16.2,'
        "cheteron,The addon is great.\n"
    )


def test_update_versions_csv_merges_by_version() -> None:
    """Append version-history rows by version."""
    updated, changed = update_versions_csv(
        "",
        [
            VersionEvent(
                version="0.16.2",
                date="2026-05-23",
                published_at="2026-05-23T15:22:00Z",
                downloads=1828,
                compatibility="Blender 4.2 LTS and newer",
                platforms="Windows; macOS Apple Silicon; Linux",
                package_sizes="Windows=9.1 MB",
                status="Approved",
            ),
        ],
    )

    assert changed is True
    assert updated == (
        "version,date,published_at,downloads,compatibility,platforms,"
        "package_sizes,status\n"
        "0.16.2,2026-05-23,2026-05-23T15:22:00Z,1828,"
        "Blender 4.2 LTS and newer,Windows; macOS Apple Silicon; Linux,"
        "Windows=9.1 MB,Approved\n"
    )


def test_update_github_releases_csv_merges_by_tag() -> None:
    """Append GitHub release rows by tag."""
    updated, changed = update_github_releases_csv(
        "",
        [
            GitHubReleaseEvent(
                tag="v0.16.2",
                date="2026-05-23",
                published_at="2026-05-23T13:11:09Z",
                name="v0.16.2",
                url="https://github.com/kmarchais/mmgpy/releases/tag/v0.16.2",
            ),
        ],
    )

    assert changed is True
    assert updated == (
        "tag,date,published_at,name,url\n"
        "v0.16.2,2026-05-23,2026-05-23T13:11:09Z,v0.16.2,"
        "https://github.com/kmarchais/mmgpy/releases/tag/v0.16.2\n"
    )


def test_update_github_docs_csv_merges_by_sha_and_path() -> None:
    """Append GitHub docs rows by commit and path."""
    updated, changed = update_github_docs_csv(
        "",
        [
            GitHubDocsEvent(
                sha="abc123",
                date="2026-06-01",
                committed_at="2026-06-01T12:30:00Z",
                path="/docs/",
                message="Update docs",
                url="https://github.com/kmarchais/mmgpy/commit/abc123",
            ),
        ],
    )

    assert changed is True
    assert updated == (
        "sha,date,committed_at,path,message,url\n"
        "abc123,2026-06-01,2026-06-01T12:30:00Z,/docs/,Update docs,"
        "https://github.com/kmarchais/mmgpy/commit/abc123\n"
    )


def test_generated_event_rows_include_expected_marker_types() -> None:
    """Generate plot marker rows from tracked source events."""
    rows = generated_event_rows(
        "date,downloads,reviews,rating,current_version\n"
        "2026-06-18,1776,1,4.5,0.16.2\n"
        "2026-06-19,1887,2,5.0,0.16.2\n",
        [
            ReviewEvent(
                review_id="7828",
                date="2026-06-19",
                reviewed_at="June 19, 2026, 7:02 p.m.",
                score=5,
                version="v0.16.2",
            ),
        ],
        [
            VersionEvent(
                version="0.15.0",
                date="2026-05-20",
                published_at="2026-05-20T15:47:00Z",
                downloads=9,
                compatibility="Blender 4.2 LTS and newer",
                platforms="Windows",
                package_sizes="all=148.9 MB",
                status="Awaiting Review",
            ),
            VersionEvent(
                version="0.16.2",
                date="2026-05-23",
                published_at="2026-05-23T15:22:00Z",
                downloads=1828,
                compatibility="Blender 4.2 LTS and newer",
                platforms="Windows; macOS Apple Silicon; Linux",
                package_sizes="Windows=9.1 MB",
                status="Approved",
            ),
        ],
        [
            GitHubReleaseEvent(
                tag="v0.16.2",
                date="2026-05-23",
                published_at="2026-05-23T13:11:09Z",
                name="v0.16.2",
                url="https://github.com/kmarchais/mmgpy/releases/tag/v0.16.2",
            ),
        ],
        [
            GitHubDocsEvent(
                sha="abc123",
                date="2026-06-01",
                committed_at="2026-06-01T12:30:00Z",
                path="/docs/",
                message="Update docs",
                url="https://github.com/kmarchais/mmgpy/commit/abc123",
            ),
        ],
    )

    assert {row["type"] for row in rows} == {
        "github_docs",
        "github_release",
        "platform_package_change",
        "rating_change",
        "review",
        "version_release",
    }


def test_update_events_csv_preserves_manual_rows() -> None:
    """Keep manual marker rows while adding generated events."""
    existing = (
        "date,type,label,version,value,source_url\n"
        "2026-06-01,promotion,Forum post,,,"
        "https://example.com/forum\n"
    )

    updated, changed = update_events_csv(
        existing,
        EventSources(
            daily_csv="date,downloads,reviews,rating\n2026-06-19,1887,2,5.0\n",
            reviews=[],
            versions=[],
            github_releases=[],
            github_docs=[],
        ),
    )

    assert changed is False
    assert updated == existing
