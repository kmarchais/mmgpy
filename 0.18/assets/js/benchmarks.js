/**
 * Benchmark trend chart renderer.
 *
 * Loads benchmark data from /bench/data.js (written by github-action-benchmark)
 * and renders Chart.js line charts inside elements with class "benchmark-chart".
 * Only activates on pages that contain the chart container.
 */
(function () {
  "use strict";

  const container = document.getElementById("benchmark-charts");
  if (!container) return;

  // Resolve the data URL relative to the site root.
  // The site lives at /mmgpy/ and bench data is at /mmgpy/bench/data.js.
  const base =
    document.querySelector("link[rel='canonical']")?.href.split("/").slice(0, 4).join("/") ||
    window.location.origin + "/mmgpy";
  const dataUrl = base + "/bench/data.js";

  function getThemeColors() {
    const isDark =
      document.body.getAttribute("data-md-color-scheme") === "slate";
    return {
      text: isDark ? "#ccc" : "#333",
      grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      line: "#3572a5",
      fill: isDark ? "rgba(53,114,165,0.2)" : "rgba(53,114,165,0.15)",
    };
  }

  function collectBenchesPerTestCase(entries) {
    const map = new Map();
    for (const entry of entries) {
      for (const bench of entry.benches) {
        const result = { commit: entry.commit, date: entry.date, bench };
        const arr = map.get(bench.name);
        if (arr === undefined) {
          map.set(bench.name, [result]);
        } else {
          arr.push(result);
        }
      }
    }
    return map;
  }

  function groupByPrefix(benchMap) {
    const groups = new Map();
    for (const [name, data] of benchMap) {
      // Extract group from path: "benchmarks/bench_remesh_3d.py::Class::test_name" -> "bench_remesh_3d"
      const match = name.match(/bench_([^.]+)\.py/);
      const group = match ? match[1] : "other";
      if (!groups.has(group)) {
        groups.set(group, new Map());
      }
      // Short name: just the test function name
      const shortName = name.split("::").pop();
      groups.get(group).set(shortName, data);
    }
    return groups;
  }

  function formatTime(seconds) {
    if (seconds < 0.001) return (seconds * 1e6).toFixed(1) + " \u00b5s";
    if (seconds < 1) return (seconds * 1000).toFixed(2) + " ms";
    return seconds.toFixed(2) + " s";
  }

  function formatGroupName(name) {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function renderChart(parent, name, dataset) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText =
      "position:relative;margin:1em 0;padding:0.5em;border-radius:8px";

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "max-height:300px";
    wrapper.appendChild(canvas);
    parent.appendChild(wrapper);

    const colors = getThemeColors();

    new Chart(canvas, {
      type: "line",
      data: {
        labels: dataset.map((d) => d.commit.id.slice(0, 7)),
        datasets: [
          {
            label: name,
            data: dataset.map((d) => d.bench.value),
            borderColor: colors.line,
            backgroundColor: colors.fill,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: name,
            color: colors.text,
            font: { size: 14 },
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const d = dataset[items[0].dataIndex];
                return d.commit.id.slice(0, 7);
              },
              beforeBody: (items) => {
                const d = dataset[items[0].dataIndex];
                return d.commit.message.split("\n")[0].slice(0, 60);
              },
              label: (item) => formatTime(item.raw),
            },
          },
        },
        scales: {
          x: {
            ticks: { color: colors.text, maxRotation: 45 },
            grid: { color: colors.grid },
          },
          y: {
            ticks: {
              color: colors.text,
              callback: (v) => formatTime(v),
            },
            grid: { color: colors.grid },
            beginAtZero: true,
          },
        },
        onClick: (_event, elements) => {
          if (elements.length > 0) {
            const url = dataset[elements[0].index].commit.url;
            window.open(url, "_blank");
          }
        },
      },
    });
  }

  function render(data) {
    const entries = data.entries?.Benchmark || [];
    if (entries.length === 0) {
      container.innerHTML =
        '<p class="md-typeset">No benchmark data available yet.</p>';
      return;
    }

    // Update last-updated info
    const info = document.getElementById("benchmark-info");
    if (info) {
      info.textContent =
        entries.length +
        " data points, last updated " +
        new Date(data.lastUpdate).toLocaleDateString();
    }

    const benchMap = collectBenchesPerTestCase(entries);
    const groups = groupByPrefix(benchMap);

    for (const [groupName, benches] of [...groups.entries()].sort()) {
      const section = document.createElement("div");
      section.style.cssText = "margin:2em 0";

      const heading = document.createElement("h3");
      heading.textContent = formatGroupName(groupName);
      heading.id = "bench-" + groupName;
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.style.cssText =
        "display:grid;grid-template-columns:repeat(auto-fit,minmax(450px,1fr));gap:1em";

      for (const [benchName, benchData] of [...benches.entries()].sort()) {
        renderChart(grid, benchName, benchData);
      }

      section.appendChild(grid);
      container.appendChild(section);
    }
  }

  // Load data.js dynamically from the bench/ directory on gh-pages
  const script = document.createElement("script");
  script.src = dataUrl;
  script.onload = function () {
    if (window.BENCHMARK_DATA) {
      render(window.BENCHMARK_DATA);
    } else {
      container.innerHTML =
        '<p class="md-typeset">Failed to load benchmark data.</p>';
    }
  };
  script.onerror = function () {
    container.innerHTML =
      '<p class="md-typeset">Benchmark data not available. It will appear after the first push to main.</p>';
  };
  document.head.appendChild(script);
})();
