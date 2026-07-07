/**
 * Blender extension marketplace stats renderer.
 *
 * Consumes the static JSON asset exported by scripts/export_blender_extension_stats.py
 * and renders summary metrics, a download trend, and public review cards.
 */
(function () {
  "use strict";

  const root = document.getElementById("blender-extension-stats");
  if (!root) return;

  const statsUrl = new URL(
    root.dataset.statsUrl || "../assets/data/blender-extension-stats.json",
    window.location.href,
  );
  const numberFormat = new Intl.NumberFormat();

  function getThemeColors() {
    const isDark =
      document.body.getAttribute("data-md-color-scheme") === "slate";
    return {
      text: isDark ? "#d8d8d8" : "#222222",
      muted: isDark ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.56)",
      grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      downloads: "#d0472f",
      downloadsFill: isDark
        ? "rgba(208,71,47,0.22)"
        : "rgba(208,71,47,0.14)",
      reviews: "#f2a900",
      releases: "#3f7cac",
    };
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function formatNumber(value) {
    if (value === null || value === undefined || value === "") return "n/a";
    return numberFormat.format(value);
  }

  function formatDate(value) {
    if (!value) return "";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(value + "T00:00:00Z"));
  }

  function formatRating(value) {
    if (value === null || value === undefined || value === "") return "n/a";
    return Number(value).toFixed(1) + " / 5";
  }

  function normalizeVersion(version) {
    if (!version) return "n/a";
    return version.startsWith("v") ? version : "v" + version;
  }

  function formatStars(score) {
    const rounded = Math.max(0, Math.min(5, Number(score) || 0));
    return "\u2605".repeat(rounded) + "\u2606".repeat(5 - rounded);
  }

  function newestFirst(rows) {
    return [...rows].sort((a, b) => {
      const dateCompare = String(b.date).localeCompare(String(a.date));
      if (dateCompare !== 0) return dateCompare;
      return String(b.review_id || "").localeCompare(String(a.review_id || ""));
    });
  }

  function indexForDate(daily, date) {
    const exactIndex = daily.findIndex((row) => row.date === date);
    if (exactIndex !== -1) return exactIndex;

    const target = Date.parse(date + "T00:00:00Z");
    const laterIndex = daily.findIndex(
      (row) => Date.parse(row.date + "T00:00:00Z") >= target,
    );
    return laterIndex === -1 ? daily.length - 1 : laterIndex;
  }

  function appendMetric(grid, label, value, detail) {
    const card = createElement("div", "mmgpy-stat-card");
    card.appendChild(createElement("div", "mmgpy-stat-label", label));
    card.appendChild(createElement("div", "mmgpy-stat-value", value));
    if (detail) card.appendChild(createElement("div", "mmgpy-stat-detail", detail));
    grid.appendChild(card);
  }

  function renderHeader(parent, payload, latest) {
    const header = createElement("div", "mmgpy-stats-header");
    const copy = createElement("div", "mmgpy-stats-heading");
    copy.appendChild(createElement("p", "mmgpy-stats-kicker", "Marketplace pulse"));
    copy.appendChild(
      createElement(
        "p",
        "mmgpy-stats-summary",
        "Daily Blender Extensions stats with public review signals.",
      ),
    );
    header.appendChild(copy);

    const source = createElement("a", "mmgpy-stats-source", "Open listing");
    source.href = payload.source_url || "https://extensions.blender.org/add-ons/mmgpy/";
    source.target = "_blank";
    source.rel = "noopener";
    header.appendChild(source);
    parent.appendChild(header);

    const grid = createElement("div", "mmgpy-stat-grid");
    const first = payload.daily[0];
    const gained =
      first && latest.downloads !== undefined
        ? latest.downloads - first.downloads
        : null;
    appendMetric(
      grid,
      "Downloads",
      formatNumber(latest.downloads),
      gained && gained > 0
        ? "+" + formatNumber(gained) + " since " + formatDate(first.date)
        : "Current marketplace total",
    );
    appendMetric(
      grid,
      "Reviews",
      formatNumber(latest.reviews ?? payload.reviews.length),
      formatRating(latest.rating) + " average rating",
    );
    appendMetric(
      grid,
      "Current version",
      normalizeVersion(latest.current_version),
      latest.compatibility || "Blender Extensions listing",
    );
    appendMetric(
      grid,
      "Platforms",
      latest.platforms || "Windows, macOS, Linux",
      latest.package_sizes || "Bundled extension zips",
    );
    parent.appendChild(grid);

    if (payload.generated_at) {
      parent.appendChild(
        createElement(
          "p",
          "mmgpy-stats-updated",
          "Stats asset generated " +
            new Date(payload.generated_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            }),
        ),
      );
    }
  }

  function renderChart(parent, payload) {
    const panel = createElement("div", "mmgpy-chart-panel");
    const heading = createElement("div", "mmgpy-panel-heading");
    heading.appendChild(createElement("h3", "", "Download trend"));
    heading.appendChild(
      createElement(
        "p",
        "",
        "Review and release markers are plotted on the cumulative download line.",
      ),
    );
    panel.appendChild(heading);

    if (!window.Chart || payload.daily.length < 2) {
      panel.appendChild(
        createElement(
          "p",
          "mmgpy-empty-state",
          "Historical download data will appear here after the tracker has at least two samples.",
        ),
      );
      parent.appendChild(panel);
      return;
    }

    const canvasWrap = createElement("div", "mmgpy-chart-wrap");
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-label", "Blender extension download trend");
    canvasWrap.appendChild(canvas);
    panel.appendChild(canvasWrap);
    parent.appendChild(panel);

    const colors = getThemeColors();
    const daily = payload.daily;
    const releaseEvents = payload.events.filter(
      (event) => event.type === "version_release",
    );
    const reviewMarkers = payload.reviews.map((review) => {
      const index = indexForDate(daily, review.date);
      return {
        x: index,
        y: daily[index].downloads,
        review,
      };
    });
    const releaseMarkers = releaseEvents.map((event) => {
      const index = indexForDate(daily, event.date);
      return {
        x: index,
        y: daily[index].downloads,
        event,
      };
    });

    new Chart(canvas, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Downloads",
            data: daily.map((row, index) => ({
              x: index,
              y: row.downloads,
              row,
            })),
            borderColor: colors.downloads,
            backgroundColor: colors.downloadsFill,
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.28,
          },
          {
            label: "Reviews",
            type: "scatter",
            data: reviewMarkers,
            borderColor: colors.reviews,
            backgroundColor: colors.reviews,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointStyle: "star",
          },
          {
            label: "Releases",
            type: "scatter",
            data: releaseMarkers,
            borderColor: colors.releases,
            backgroundColor: colors.releases,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointStyle: "triangle",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "nearest" },
        plugins: {
          legend: {
            labels: { color: colors.text, boxWidth: 12, usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const raw = items[0].raw;
                if (raw.review) return formatDate(raw.review.date);
                if (raw.event) return formatDate(raw.event.date);
                return formatDate(raw.row.date);
              },
              label: (item) => {
                const raw = item.raw;
                if (raw.review) {
                  return (
                    raw.review.score +
                    " / 5 review for " +
                    normalizeVersion(raw.review.version)
                  );
                }
                if (raw.event) return raw.event.label;
                return formatNumber(raw.row.downloads) + " downloads";
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: daily.length - 1,
            ticks: {
              color: colors.muted,
              maxTicksLimit: 6,
              callback: (value) => {
                const row = daily[Math.round(value)];
                return row ? formatDate(row.date).replace(", ", " ") : "";
              },
            },
            grid: { color: colors.grid },
          },
          y: {
            beginAtZero: false,
            ticks: {
              color: colors.muted,
              callback: (value) => formatNumber(value),
            },
            grid: { color: colors.grid },
          },
        },
      },
    });
  }

  function renderReviews(parent, payload) {
    const section = createElement("div", "mmgpy-reviews-section");
    const heading = createElement("div", "mmgpy-panel-heading");
    heading.appendChild(createElement("h3", "", "Latest reviews"));
    heading.appendChild(
      createElement(
        "p",
        "",
        "Public reviews from the Blender Extensions listing.",
      ),
    );
    section.appendChild(heading);

    if (payload.reviews.length === 0) {
      section.appendChild(
        createElement(
          "p",
          "mmgpy-empty-state",
          "Reviews will appear here after the marketplace listing receives them.",
        ),
      );
      parent.appendChild(section);
      return;
    }

    const grid = createElement("div", "mmgpy-review-grid");
    for (const review of newestFirst(payload.reviews).slice(0, 4)) {
      const card = createElement("article", "mmgpy-review-card");
      const meta = createElement("div", "mmgpy-review-meta");
      meta.appendChild(
        createElement("span", "mmgpy-review-score", formatStars(review.score)),
      );
      meta.appendChild(
        createElement(
          "span",
          "mmgpy-review-version",
          normalizeVersion(review.version) + " - " + formatDate(review.date),
        ),
      );
      card.appendChild(meta);

      if (review.body) {
        card.appendChild(createElement("p", "mmgpy-review-body", review.body));
      }

      const footer = createElement("div", "mmgpy-review-footer");
      footer.appendChild(
        createElement("span", "", review.author || "Blender Extensions user"),
      );
      const link = createElement("a", "", "View");
      link.href = review.source_url || payload.reviews_url;
      link.target = "_blank";
      link.rel = "noopener";
      footer.appendChild(link);
      card.appendChild(footer);
      grid.appendChild(card);
    }
    section.appendChild(grid);

    const allReviews = createElement("a", "mmgpy-review-link", "Read all reviews");
    allReviews.href = payload.reviews_url;
    allReviews.target = "_blank";
    allReviews.rel = "noopener";
    section.appendChild(allReviews);
    parent.appendChild(section);
  }

  function render(payload) {
    const daily = Array.isArray(payload.daily) ? payload.daily : [];
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    const events = Array.isArray(payload.events) ? payload.events : [];
    const normalizedPayload = { ...payload, daily, reviews, events };
    root.textContent = "";

    if (daily.length === 0) {
      root.appendChild(
        createElement(
          "p",
          "mmgpy-empty-state",
          "Blender Extensions stats are not available yet.",
        ),
      );
      return;
    }

    const latest = daily[daily.length - 1];
    renderHeader(root, normalizedPayload, latest);
    renderChart(root, normalizedPayload);
    renderReviews(root, normalizedPayload);
  }

  fetch(statsUrl, { cache: "no-cache" })
    .then((response) => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(render)
    .catch((error) => {
      root.textContent = "";
      root.appendChild(
        createElement(
          "p",
          "mmgpy-empty-state",
          "Blender Extensions stats are not available in this docs build.",
        ),
      );
      root.appendChild(createElement("p", "mmgpy-empty-detail", error.message));
    });
})();
