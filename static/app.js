const app = document.querySelector("#app");

const state = {
  summary: null,
  provenance: null,
  activities: [],
  detailCache: new Map(),
  charts: [],
};

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const chartColors = {
  route: cssVar("--pe-status-teal"),
  hr: cssVar("--pe-status-red"),
  elevation: cssVar("--pe-status-green"),
  cadence: cssVar("--pe-status-yellow"),
  distance: cssVar("--pe-text-secondary"),
  start: cssVar("--pe-status-green"),
  finish: cssVar("--pe-status-red"),
  zoneRamp: [
    cssVar("--pe-status-red"),
    cssVar("--pe-status-orange"),
    cssVar("--pe-status-yellow"),
    cssVar("--pe-status-teal"),
    cssVar("--pe-status-green"),
  ],
  grid: cssVar("--pe-border-subtle"),
  text: cssVar("--pe-text-metadata"),
  tooltipBg: cssVar("--pe-panel-raised"),
  tooltipBorder: cssVar("--pe-border-strong"),
  tooltipText: cssVar("--pe-text-primary"),
};

const tooltipBase = {
  backgroundColor: chartColors.tooltipBg,
  borderColor: chartColors.tooltipBorder,
  textStyle: { color: chartColors.tooltipText, fontFamily: "Inter, system-ui, sans-serif" },
};
const axisLabelBase = { color: chartColors.text, fontFamily: "JetBrains Mono, monospace", fontSize: 10 };
const legendBase = { textStyle: { color: chartColors.text, fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500 } };

async function init() {
  const [summary, provenance] = await Promise.all([
    getJSON("/api/summary"),
    getJSON("/api/provenance"),
  ]);
  state.summary = summary;
  state.provenance = provenance;
  state.activities = summary.activities || [];

  if (location.pathname === "/") {
    history.replaceState(null, "", "/runs");
  }
  await renderFromLocation();
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${url}`);
  return res.json();
}

async function loadDetail(id) {
  if (!state.detailCache.has(id)) {
    state.detailCache.set(id, getJSON(`/api/activities/${encodeURIComponent(id)}`));
  }
  return state.detailCache.get(id);
}

async function renderFromLocation() {
  const parts = location.pathname.split("/").filter(Boolean);
  if (parts[0] === "runs" && parts[1]) {
    await renderDetail(parts[1]);
    return;
  }
  await renderOverview();
}

async function renderOverview() {
  disposeCharts();
  renderShell({ mode: "list", content: overviewTemplate() });
}

async function renderDetail(id) {
  disposeCharts();
  const detail = await loadDetail(id);
  renderShell({ mode: "detail", content: detailTemplate(detail) });
  renderDetailCharts(detail);
}

function renderShell({ mode, content }) {
  app.className = "";
  const cls = mode === "list" ? "list-shell" : "detail-shell";
  app.innerHTML = `<div class="${cls}">${content}</div>`;
  bindNavigation();
}

// ---------- Page 1: Run List ----------

function overviewTemplate() {
  const summary = state.summary;
  return `
    <div class="toolbar">
      <div>
        <p class="eyebrow">Desktop demo</p>
        <h1 class="page-title">Runs at a glance</h1>
        <p class="page-subtitle">
          Four Garmin activities captured through the generated CLI, normalized into SQLite,
          and presented as a local dashboard for screenshots and short walkthroughs.
        </p>
      </div>
    </div>

    <div class="digest-header">
      ${metricCard("Runs", summary.activity_count, "activities")}
      ${metricCard("Distance", `${round(summary.total_distance_km, 1)} km`, dateRange(summary))}
      ${metricCard("Time", summary.total_duration, "total duration")}
      ${metricCard("Avg HR", `${round(summary.avg_hr_bpm, 0)} bpm`, "heart rate")}
      ${metricCard("Ascent", `${round(summary.total_ascent_m, 0)} m`, "recorded climb")}
      ${metricCard("GPS Points", formatInteger(summary.track_point_count), "route samples")}
    </div>

    <div class="tile-grid">
      ${state.activities.map(runTile).join("")}
    </div>
  `;
}

function runTile(activity) {
  return `
    <button class="run-tile" data-route="/runs/${escapeAttr(activity.id)}">
      <div class="run-tile-top">
        <span class="run-chip">${escapeHTML(activity.type || "Run")}</span>
        <span class="run-tile-date">${formatDate(activity.activity_date)}</span>
      </div>
      <div class="run-tile-name">${escapeHTML(activity.name)}</div>
      <div class="run-tile-stats">
        ${runTileStat("Distance", formatDistance(activity.distance_km))}
        ${runTileStat("Time", formatSeconds(activity.duration_seconds))}
        ${runTileStat("Pace", formatPace(activity.avg_pace_seconds_per_km))}
        ${runTileStat("Avg HR", formatBpm(activity.avg_hr_bpm))}
      </div>
    </button>
  `;
}

function runTileStat(label, value) {
  return `
    <div class="run-tile-stat">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value ?? "--")}</strong>
    </div>
  `;
}

// ---------- Page 2: Run Detail ----------

function detailTemplate(detail) {
  const { activity, laps, segments, zones, exports: exps } = detail;
  return `
    <div class="toolbar">
      <div>
        <p class="eyebrow">${escapeHTML(activity.type || "Run")} detail</p>
        <h1 class="page-title">${escapeHTML(activity.name)}</h1>
        <p class="page-subtitle">${formatDate(activity.activity_date)} · captured from ${escapeHTML(activity.device_name || "Garmin device")}</p>
      </div>
      <div class="export-row">
        ${exps.map((item) => exportLink(activity.id, item)).join("")}
      </div>
      <a class="nav-button" href="/runs" data-route="/runs">All runs</a>
    </div>

    <div class="detail-3col">

      <div class="left-col stack">
        ${metricCard("Distance", formatDistance(activity.distance_km), "total")}
        ${metricCard("Time", formatSeconds(activity.duration_seconds), "elapsed")}
        ${metricCard("Pace", formatPace(activity.avg_pace_seconds_per_km), "average")}
        ${metricCard("Ascent", `${round(activity.total_ascent_m, 0)} m`, "gain")}
        ${metricCard("Avg HR", formatBpm(activity.avg_hr_bpm), "heart rate")}
        ${metricCard("Cadence", formatSpm(activity.avg_run_cadence_spm), "average")}
        ${metricCard("Calories", formatInteger(activity.calories), "active")}
        <section class="panel">
          <div class="panel-title">
            <h2>Heart-rate zones</h2>
            <span>${zones.length} zones</span>
          </div>
          <div class="chart zones-chart" id="zonesChart"></div>
        </section>
      </div>

      <div class="center-col stack">
        <section class="panel">
          <div class="panel-title">
            <h2>Route</h2>
            <span>${formatInteger(detail.track.length)} GPS points</span>
          </div>
          ${detail.track.length ? '<div class="chart route-chart" id="routeChart"></div>' : '<div class="empty-state">No GPS track points recorded</div>'}
        </section>
        <section class="panel">
          <div class="panel-title">
            <h2>Performance timeline</h2>
            <span>elevation, heart rate, cadence</span>
          </div>
          <div class="chart telemetry-chart" id="telemetryChart"></div>
        </section>
      </div>

      <div class="right-col stack">
        <section class="panel">
          <div class="panel-title">
            <h2>Lap pace</h2>
            <span>${laps.length} laps</span>
          </div>
          <div class="chart laps-chart" id="lapsChart"></div>
        </section>
        <section class="table-panel">
          <div class="panel-title">
            <h2>Lap table</h2>
            <span>per kilometer view</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Lap</th>
                  <th>Distance</th>
                  <th>Time</th>
                  <th>Pace</th>
                  <th>Avg HR</th>
                  <th>Ascent</th>
                </tr>
              </thead>
              <tbody>${laps.map(lapRow).join("")}</tbody>
            </table>
          </div>
        </section>
        <section class="table-panel">
          <div class="panel-title">
            <h2>Segments</h2>
            <span>${segments.length} entries</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Segment</th>
                  <th>Time</th>
                  <th>Pace</th>
                </tr>
              </thead>
              <tbody>${segments.length ? segments.map(segmentRow).join("") : '<tr><td colspan="4">No segments recorded</td></tr>'}</tbody>
            </table>
          </div>
        </section>
        <section class="panel">
          <div class="panel-title">
            <h2>Run context</h2>
            <span>device, gear, weather</span>
          </div>
          <dl class="context-list">
            ${contextRow("Device", activity.device_name)}
            ${contextRow("Software", activity.device_software)}
            ${contextRow("Gear", activity.gear_model || activity.gear_name)}
            ${contextRow("Gear usage", activity.gear_usage)}
            ${contextRow("Weather", activity.weather_temperature)}
            ${contextRow("Wind", activity.weather_wind)}
            ${contextRow("Captured", formatDateTime(activity.captured_at))}
            ${contextRow("Garmin URL", activity.url ? `<a class="export-link" href="${escapeAttr(activity.url)}" target="_blank" rel="noreferrer">Open</a>` : "--", true)}
          </dl>
        </section>
        ${provenanceStrip(state.provenance)}
      </div>

    </div>
  `;
}

// ---------- Shared components ----------

function provenanceStrip(provenance) {
  return `
    <section class="pipeline-strip">
      <div>
        <h2>Garmin profile → generated CLI → SQLite → local dashboard</h2>
        <p>Latest capture ${formatDateTime(provenance.latest_capture)} from ${escapeHTML(provenance.database)}.</p>
      </div>
      ${pipelineMetric("Runs", provenance.activity_count)}
      ${pipelineMetric("GPS points", formatInteger(provenance.track_point_count))}
      ${pipelineMetric("Exports", formatInteger(provenance.export_count))}
      ${pipelineMetric("Bundles", formatInteger(provenance.source_bundle_count))}
    </section>
  `;
}

function metricCard(label, value, note) {
  return `
    <article class="metric-card">
      <div class="metric-label">${escapeHTML(label)}</div>
      <div class="metric-value">${escapeHTML(value ?? "--")}</div>
      <div class="metric-note">${escapeHTML(note ?? "")}</div>
    </article>
  `;
}

function pipelineMetric(label, value) {
  return `
    <div class="pipeline-metric">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value ?? "--")}</strong>
    </div>
  `;
}

function contextRow(label, value, raw = false) {
  const display = value === null || value === undefined || value === "" ? "--" : value;
  return `
    <div class="context-row">
      <dt>${escapeHTML(label)}</dt>
      <dd>${raw ? display : escapeHTML(display)}</dd>
    </div>
  `;
}

function lapRow(lap) {
  return `
    <tr>
      <td>${escapeHTML(lap.lap_number ?? "--")}</td>
      <td>${formatDistance(lap.distance_km)}</td>
      <td>${formatSeconds(lap.time_seconds)}</td>
      <td>${formatPace(lap.avg_pace_seconds_per_km)}</td>
      <td>${formatBpm(lap.avg_hr_bpm)}</td>
      <td>${round(lap.total_ascent_m, 0)} m</td>
    </tr>
  `;
}

function segmentRow(segment) {
  return `
    <tr>
      <td>${escapeHTML(segment.rank || "--")}</td>
      <td>${escapeHTML(segment.name || "--")}</td>
      <td>${formatSeconds(segment.time_seconds)}</td>
      <td>${formatPace(segment.pace_seconds_per_km)}</td>
    </tr>
  `;
}

function exportLink(activityId, item) {
  return `
    <a class="export-link" href="/api/activities/${escapeAttr(activityId)}/exports/${escapeAttr(item.id)}">
      ${escapeHTML(exportLabel(item.kind))}
    </a>
  `;
}

// ---------- Navigation ----------

function bindNavigation() {
  document.querySelectorAll("[data-route]").forEach((node) => {
    node.addEventListener("click", (event) => {
      const route = node.getAttribute("data-route");
      if (!route) return;
      event.preventDefault();
      navigate(route);
    });
  });
}

async function navigate(route) {
  if (route === location.pathname) return;
  history.pushState(null, "", route);
  await renderFromLocation();
}

window.addEventListener("popstate", () => {
  renderFromLocation().catch(showError);
});

window.addEventListener("resize", () => {
  state.charts.forEach((c) => c.resize());
});

// ---------- Charts ----------

function renderDetailCharts(detail) {
  if (detail.track.length) {
    renderRouteChart("routeChart", detail.track);
  }
  renderTelemetryChart("telemetryChart", detail.track);
  renderLapsChart("lapsChart", detail.laps);
  renderZonesChart("zonesChart", detail.zones);
}

function chart(id) {
  const node = document.getElementById(id);
  if (!node || typeof echarts === "undefined") return null;
  const instance = echarts.init(node, null, { renderer: "canvas" });
  state.charts.push(instance);
  return instance;
}

function disposeCharts() {
  state.charts.forEach((instance) => instance.dispose());
  state.charts = [];
}

function renderRouteChart(id, track) {
  const instance = chart(id);
  if (!instance || !track.length) return;
  const line = track.map((point) => [point.lon, point.lat]);
  const start = line[0];
  const end = line[line.length - 1];

  instance.setOption({
    backgroundColor: "transparent",
    animationDuration: 900,
    grid: { left: 8, right: 8, top: 8, bottom: 8 },
    tooltip: {
      trigger: "item",
      ...tooltipBase,
      formatter: (params) => {
        const value = params.value || [];
        return `${params.seriesName}<br>${Number(value[1]).toFixed(5)}, ${Number(value[0]).toFixed(5)}`;
      },
    },
    xAxis: routeAxis(),
    yAxis: routeAxis(),
    series: [
      {
        name: "GPS route",
        type: "line",
        data: line,
        symbol: "none",
        smooth: true,
        lineStyle: { width: 3, color: chartColors.route },
      },
      {
        name: "Start",
        type: "scatter",
        data: [start],
        symbolSize: 12,
        itemStyle: { color: chartColors.start },
      },
      {
        name: "Finish",
        type: "scatter",
        data: [end],
        symbolSize: 12,
        itemStyle: { color: chartColors.finish },
      },
    ],
  });
}

function routeAxis() {
  return {
    type: "value",
    scale: true,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { show: false },
    splitLine: { show: false },
  };
}

function renderTelemetryChart(id, track) {
  const instance = chart(id);
  if (!instance || !track.length) return;
  const enriched = enrichTrack(track);
  instance.setOption({
    backgroundColor: "transparent",
    color: [chartColors.elevation, chartColors.hr, chartColors.cadence],
    tooltip: {
      trigger: "axis",
      ...tooltipBase,
      valueFormatter: (value) => (value === null || value === undefined ? "--" : round(value, 0)),
    },
    legend: {
      top: 0,
      right: 8,
      ...legendBase,
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: { left: 44, right: 58, top: 42, bottom: 34 },
    xAxis: axis("Distance km", (value) => round(value, 1)),
    yAxis: [
      metricAxis("m", 0),
      metricAxis("bpm", 1),
      metricAxis("spm", 2),
    ],
    series: [
      {
        name: "Elevation",
        type: "line",
        yAxisIndex: 0,
        data: enriched.map((point) => [point.distance_km, point.elevation_m]),
        symbol: "none",
        smooth: true,
        lineStyle: { width: 2 },
      },
      {
        name: "Heart rate",
        type: "line",
        yAxisIndex: 1,
        data: enriched.map((point) => [point.distance_km, point.hr_bpm]),
        symbol: "none",
        smooth: true,
        lineStyle: { width: 2 },
      },
      {
        name: "Cadence",
        type: "line",
        yAxisIndex: 2,
        data: enriched.map((point) => [point.distance_km, point.cadence_spm]),
        symbol: "none",
        smooth: true,
        lineStyle: { width: 2 },
      },
    ],
  });
}

function renderLapsChart(id, laps) {
  const instance = chart(id);
  if (!instance || !laps.length) return;
  const labels = laps.map((lap) => `L${lap.lap_number}`);
  instance.setOption({
    backgroundColor: "transparent",
    color: [chartColors.distance, chartColors.hr],
    tooltip: {
      trigger: "axis",
      ...tooltipBase,
      formatter: (params) => {
        const pace = params.find((item) => item.seriesName === "Pace");
        const hr = params.find((item) => item.seriesName === "Avg HR");
        return `${params[0].axisValue}<br>Pace: ${formatPace(pace?.value)}<br>Avg HR: ${formatBpm(hr?.value)}`;
      },
    },
    legend: { top: 0, right: 8, ...legendBase },
    grid: { left: 50, right: 44, top: 42, bottom: 34 },
    xAxis: {
      type: "category",
      data: labels,
      axisLine: { lineStyle: { color: chartColors.grid } },
      axisTick: { show: false },
      axisLabel: axisLabelBase,
    },
    yAxis: [
      {
        type: "value",
        inverse: true,
        axisLabel: { ...axisLabelBase, formatter: (value) => formatPace(value).replace(" /km", "") },
        splitLine: { lineStyle: { color: chartColors.grid } },
      },
      {
        type: "value",
        axisLabel: axisLabelBase,
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "Pace",
        type: "bar",
        data: laps.map((lap) => lap.avg_pace_seconds_per_km),
        barMaxWidth: 18,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: "Avg HR",
        type: "line",
        yAxisIndex: 1,
        data: laps.map((lap) => lap.avg_hr_bpm),
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
    ],
  });
}

function renderZonesChart(id, zones) {
  const instance = chart(id);
  if (!instance || !zones.length) return;
  const ordered = [...zones].sort((a, b) => b.zone_number - a.zone_number);
  instance.setOption({
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      ...tooltipBase,
      formatter: (params) => {
        const zone = ordered[params[0].dataIndex];
        return `Zone ${zone.zone_number}<br>${formatSeconds(zone.time_seconds)}<br>${round(zone.percent, 0)}%`;
      },
    },
    grid: { left: 54, right: 16, top: 12, bottom: 24 },
    xAxis: {
      type: "value",
      max: 100,
      axisLabel: { ...axisLabelBase, formatter: "{value}%" },
      splitLine: { lineStyle: { color: chartColors.grid } },
    },
    yAxis: {
      type: "category",
      data: ordered.map((zone) => `Z${zone.zone_number}`),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: axisLabelBase,
    },
    series: [
      {
        type: "bar",
        data: ordered.map((zone, index) => ({
          value: zone.percent || 0,
          itemStyle: { color: chartColors.zoneRamp[index % chartColors.zoneRamp.length] },
        })),
        barMaxWidth: 14,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
      },
    ],
  });
}

function axis(name, formatter) {
  return {
    type: "value",
    name,
    nameTextStyle: { color: chartColors.text, fontFamily: "JetBrains Mono, monospace", fontSize: 10 },
    axisLine: { lineStyle: { color: chartColors.grid } },
    axisTick: { show: false },
    axisLabel: { ...axisLabelBase, formatter },
    splitLine: { lineStyle: { color: chartColors.grid } },
  };
}

function metricAxis(name, index) {
  return {
    type: "value",
    name,
    position: index === 0 ? "left" : "right",
    offset: index === 2 ? 42 : 0,
    nameTextStyle: { color: chartColors.text, fontFamily: "JetBrains Mono, monospace", fontSize: 10 },
    axisLabel: axisLabelBase,
    splitLine: { show: index === 0, lineStyle: { color: chartColors.grid } },
  };
}

// ---------- Data utilities ----------

function enrichTrack(track) {
  let distance = 0;
  let previous = null;
  return track.map((point) => {
    if (previous) distance += haversineKm(previous, point);
    previous = point;
    return {
      ...point,
      distance_km: Number(distance.toFixed(3)),
    };
  });
}

function haversineKm(a, b) {
  const radiusKm = 6371;
  const dLat = radians(b.lat - a.lat);
  const dLon = radians(b.lon - a.lon);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(h));
}

function radians(value) {
  return (Number(value) * Math.PI) / 180;
}

// ---------- Formatters ----------

function formatSeconds(value) {
  if (value === null || value === undefined || value === "") return "--";
  let seconds = Math.round(Number(value));
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`
    : `${minutes}:${String(rest).padStart(2, "0")}`;
}

function formatPace(value) {
  if (value === null || value === undefined || value === "") return "--";
  return `${formatSeconds(value)} /km`;
}

function formatDistance(value) {
  if (value === null || value === undefined || value === "") return "--";
  return `${round(value, 2)} km`;
}

function formatBpm(value) {
  if (value === null || value === undefined || value === "") return "--";
  return `${Math.round(Number(value))} bpm`;
}

function formatSpm(value) {
  if (value === null || value === undefined || value === "") return "--";
  return `${Math.round(Number(value))} spm`;
}

function formatInteger(value) {
  if (value === null || value === undefined || value === "") return "--";
  return Number(value).toLocaleString();
}

function round(value, digits) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? 1 : 0,
  });
}

function formatDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function shortDate(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value) {
  if (!value) return "--";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function dateRange(summary) {
  if (!summary.first_date || !summary.last_date) return "";
  return `${shortDate(summary.first_date)} to ${shortDate(summary.last_date)}`;
}

function exportLabel(kind) {
  return {
    gpx: "GPX",
    tcx: "TCX",
    original_fit_zip: "FIT",
    splits_csv: "Splits",
  }[kind] || kind;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHTML(value);
}

function showError(error) {
  app.className = "";
  app.innerHTML = `
    <div class="error-state">
      <h1>Dashboard failed to load</h1>
      <pre>${escapeHTML(error.stack || error.message || error)}</pre>
    </div>
  `;
}

init().catch(showError);
