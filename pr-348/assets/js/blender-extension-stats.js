/**
 * Blender extension marketplace stats renderer.
 *
 * Loads the public stats JSON published by the daily tracker to gh-pages and
 * renders a graph-first marketplace pulse on the Blender extension docs page.
 */
(function () {
  "use strict";

  const root = document.getElementById("blender-extension-stats");
  if (!root) return;

  const EXTENSION_URL = "https://extensions.blender.org/add-ons/mmgpy/";
  const REVIEWS_URL = EXTENSION_URL + "reviews/";
  const numberFormat = new Intl.NumberFormat();

  function getThemeColors() {
    const isDark =
      document.body.getAttribute("data-md-color-scheme") === "slate";
    return {
      text: isDark ? "#e4e2ea" : "#202124",
      muted: isDark ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.58)",
      grid: isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)",
      line: "#f0b400",
      lineFill: isDark ? "rgba(240,180,0,0.18)" : "rgba(240,180,0,0.14)",
      review: "#ffca28",
      release: "#5aa6ff",
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

  function siteRoot() {
    const hostname = window.location.hostname;
    if (hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1") {
      return window.location.origin;
    }
    const canonical = document.querySelector("link[rel='canonical']")?.href;
    if (canonical) {
      return canonical.split("/").slice(0, 4).join("/");
    }
    return window.location.origin + "/mmgpy";
  }

  async function loadPayload() {
    const statsUrl =
      root.dataset.statsUrl || siteRoot() + "/blender-extension-stats.json";
    const response = await fetch(statsUrl, { cache: "no-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status + " for " + statsUrl);
    return response.json();
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

  function appendMetric(parent, label, value, detail) {
    const item = createElement("div", "mmgpy-stat-row");
    const copy = createElement("div", "");
    copy.appendChild(createElement("div", "mmgpy-stat-label", label));
    copy.appendChild(createElement("div", "mmgpy-stat-detail", detail || ""));
    item.appendChild(copy);
    item.appendChild(createElement("div", "mmgpy-stat-value", value));
    parent.appendChild(item);
  }

  function renderChart(parent, payload) {
    const daily = payload.daily;
    const latest = daily[daily.length - 1];
    const first = daily[0];
    const gained = latest.downloads - first.downloads;
    const panel = createElement("section", "mmgpy-chart-panel");
    const heading = createElement("div", "mmgpy-chart-heading");
    const copy = createElement("div", "");
    copy.appendChild(createElement("h3", "", "Downloads over time"));
    copy.appendChild(
      createElement(
        "p",
        "",
        daily.length +
          " tracker samples since " +
          formatDate(first.date) +
          (gained > 0 ? " · +" + formatNumber(gained) + " downloads" : ""),
      ),
    );
    heading.appendChild(copy);

    const listing = createElement("a", "mmgpy-stats-source", "Open listing");
    listing.href = payload.source_url || EXTENSION_URL;
    listing.target = "_blank";
    listing.rel = "noopener";
    heading.appendChild(listing);
    panel.appendChild(heading);

    if (!window.Chart || daily.length < 2) {
      panel.appendChild(
        createElement(
          "p",
          "mmgpy-empty-state",
          "Historical download data will appear after the tracker has at least two samples.",
        ),
      );
      parent.appendChild(panel);
      return;
    }

    const chartWrap = createElement("div", "mmgpy-chart-wrap");
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-label", "Blender extension cumulative downloads");
    chartWrap.appendChild(canvas);
    panel.appendChild(chartWrap);
    parent.appendChild(panel);

    const colors = getThemeColors();
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
            borderColor: colors.line,
            backgroundColor: colors.lineFill,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.24,
          },
          {
            label: "Reviews",
            type: "scatter",
            data: reviewMarkers,
            borderColor: colors.review,
            backgroundColor: colors.review,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointStyle: "star",
          },
          {
            label: "Releases",
            type: "scatter",
            data: releaseMarkers,
            borderColor: colors.release,
            backgroundColor: colors.release,
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
            align: "end",
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
              maxTicksLimit: 7,
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

  function renderStats(parent, payload) {
    const latest = payload.daily[payload.daily.length - 1];
    const card = createElement("aside", "mmgpy-stat-card");
    card.appendChild(createElement("p", "mmgpy-stats-kicker", "Marketplace pulse"));
    appendMetric(card, "Downloads", formatNumber(latest.downloads), "Current total");
    appendMetric(
      card,
      "Reviews",
      formatNumber(latest.reviews ?? payload.reviews.length),
      formatRating(latest.rating),
    );
    appendMetric(
      card,
      "Current version",
      normalizeVersion(latest.current_version),
      latest.compatibility || "Blender Extensions listing",
    );
    appendMetric(
      card,
      "Platforms",
      latest.platforms ? latest.platforms.split(";").length + " OSes" : "3 OSes",
      latest.platforms || "Windows, macOS, Linux",
    );
    if (latest.date) {
      card.appendChild(
        createElement("p", "mmgpy-stats-updated", "Updated " + formatDate(latest.date)),
      );
    }
    parent.appendChild(card);
  }

  function renderReviews(parent, payload) {
    const section = createElement("section", "mmgpy-reviews-section");
    const heading = createElement("div", "mmgpy-panel-heading");
    heading.appendChild(createElement("h3", "", "Latest reviews"));
    const reviewsLink = createElement("a", "mmgpy-review-link", "Read all reviews");
    reviewsLink.href = payload.reviews_url || REVIEWS_URL;
    reviewsLink.target = "_blank";
    reviewsLink.rel = "noopener";
    heading.appendChild(reviewsLink);
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
    for (const review of newestFirst(payload.reviews).slice(0, 3)) {
      const card = createElement("article", "mmgpy-review-card");
      const meta = createElement("div", "mmgpy-review-meta");
      meta.appendChild(
        createElement("span", "mmgpy-review-score", formatStars(review.score)),
      );
      meta.appendChild(
        createElement(
          "span",
          "mmgpy-review-version",
          normalizeVersion(review.version) + " · " + formatDate(review.date),
        ),
      );
      card.appendChild(meta);

      card.appendChild(
        createElement(
          "p",
          "mmgpy-review-body",
          review.body || review.score + " / 5 review for " + normalizeVersion(review.version),
        ),
      );

      const footer = createElement("div", "mmgpy-review-footer");
      footer.appendChild(
        createElement("span", "", review.author || "Blender Extensions user"),
      );
      const link = createElement("a", "", "View");
      link.href = review.source_url || payload.reviews_url || REVIEWS_URL;
      link.target = "_blank";
      link.rel = "noopener";
      footer.appendChild(link);
      card.appendChild(footer);
      grid.appendChild(card);
    }
    section.appendChild(grid);
    parent.appendChild(section);
  }

  function render(payload) {
    const normalizedPayload = {
      ...payload,
      daily: Array.isArray(payload.daily) ? payload.daily : [],
      reviews: Array.isArray(payload.reviews) ? payload.reviews : [],
      events: Array.isArray(payload.events) ? payload.events : [],
    };
    root.textContent = "";

    if (normalizedPayload.daily.length === 0) {
      root.appendChild(
        createElement(
          "p",
          "mmgpy-empty-state",
          "Blender Extensions stats are not available yet.",
        ),
      );
      return;
    }

    const shell = createElement("div", "mmgpy-pulse-shell");
    renderChart(shell, normalizedPayload);
    renderStats(shell, normalizedPayload);
    root.appendChild(shell);
    renderReviews(root, normalizedPayload);
  }

  loadPayload()
    .then(render)
    .catch((error) => {
      root.textContent = "";
      root.appendChild(
        createElement(
          "p",
          "mmgpy-empty-state",
          "Blender Extensions stats are not available in this browser session.",
        ),
      );
      root.appendChild(createElement("p", "mmgpy-empty-detail", error.message));
    });
})();
