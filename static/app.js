const state = {
  summary: null,
  activities: [],
  selectedId: null,
  selectedDetail: null,
};

const el = {
  rangeLabel: document.querySelector("#rangeLabel"),
  summaryGrid: document.querySelector("#summaryGrid"),
  activityCount: document.querySelector("#activityCount"),
  activityButtons: document.querySelector("#activityButtons"),
  selectedDate: document.querySelector("#selectedDate"),
  selectedTitle: document.querySelector("#selectedTitle"),
  exportRow: document.querySelector("#exportRow"),
  routeMap: document.querySelector("#routeMap"),
  statsList: document.querySelector("#statsList"),
  zonesList: document.querySelector("#zonesList"),
  lapsChart: document.querySelector("#lapsChart"),
  segmentsTable: document.querySelector("#segmentsTable"),
};

const metricDefs = [
  ["activity_count", "Activities", value => value],
  ["total_distance_km", "Distance", value => `${round(value, 1)} km`],
  ["total_duration", "Time", value => value],
  ["total_ascent_m", "Ascent", value => `${round(value, 0)} m`],
  ["track_point_count", "GPS Points", value => value],
];

const statDefs = [
  ["distance_km", "Distance", value => `${round(value, 2)} km`],
  ["duration_seconds", "Time", formatSeconds],
  ["avg_pace_seconds_per_km", "Avg Pace", formatPace],
  ["total_ascent_m", "Ascent", value => `${round(value, 0)} m`],
  ["calories", "Calories", value => value],
  ["avg_hr_bpm", "Avg HR", value => `${value} bpm`],
  ["max_hr_bpm", "Max HR", value => `${value} bpm`],
  ["moving_time_seconds", "Moving Time", formatSeconds],
  ["avg_run_cadence_spm", "Cadence", value => `${value} spm`],
  ["avg_stride_length_m", "Stride", value => `${round(value, 2)} m`],
  ["device_name", "Device", value => value],
  ["gear_model", "Gear", value => value],
];

function round(value, digits) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "--";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits > 0 ? 1 : 0 });
}

function formatSeconds(value) {
  if (value === null || value === undefined) return "--";
  let seconds = Math.round(Number(value));
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}` : `${minutes}:${String(rest).padStart(2, "0")}`;
}

function formatPace(value) {
  return `${formatSeconds(value)} /km`;
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function init() {
  state.summary = await getJSON("/api/summary");
  state.activities = state.summary.activities;
  state.selectedId = state.activities[0]?.id;
  renderSummary();
  renderActivityList();
  if (state.selectedId) await selectActivity(state.selectedId);
}

function renderSummary() {
  el.rangeLabel.textContent = `${state.summary.first_date} to ${state.summary.last_date}`;
  el.summaryGrid.innerHTML = metricDefs.map(([key, label, format]) => `
    <article class="metric-card">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${format(state.summary[key])}</div>
    </article>
  `).join("");
}

function renderActivityList() {
  el.activityCount.textContent = `${state.activities.length} runs`;
  el.activityButtons.innerHTML = state.activities.map(activity => `
    <button class="activity-button ${activity.id === state.selectedId ? "active" : ""}" data-id="${activity.id}">
      <span class="activity-name">${activity.name}</span>
      <span class="activity-meta">
        <span>${activity.activity_date}</span>
        <span>${round(activity.distance_km, 2)} km</span>
        <span>${formatSeconds(activity.duration_seconds)}</span>
        <span>${formatPace(activity.avg_pace_seconds_per_km)}</span>
      </span>
    </button>
  `).join("");
  el.activityButtons.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => selectActivity(button.dataset.id));
  });
}

async function selectActivity(id) {
  state.selectedId = id;
  renderActivityList();
  state.selectedDetail = await getJSON(`/api/activities/${id}`);
  renderDetail();
}

function renderDetail() {
  const { activity, laps, segments, zones, track, exports } = state.selectedDetail;
  el.selectedDate.textContent = activity.activity_date;
  el.selectedTitle.textContent = activity.name;
  el.exportRow.innerHTML = exports.map(item => `
    <a class="export-link" href="/api/activities/${activity.id}/exports/${item.id}">${exportLabel(item.kind)}</a>
  `).join("");
  renderRoute(track);
  renderStats(activity);
  renderZones(zones);
  renderLapsChart(laps);
  renderSegments(segments);
}

function exportLabel(kind) {
  return {
    gpx: "GPX",
    tcx: "TCX",
    original_fit_zip: "FIT",
    splits_csv: "Splits",
  }[kind] || kind;
}

function renderStats(activity) {
  el.statsList.innerHTML = statDefs.map(([key, label, format]) => {
    const value = activity[key];
    return `
      <div>
        <dt>${label}</dt>
        <dd>${value === null || value === undefined || value === "" ? "--" : format(value)}</dd>
      </div>
    `;
  }).join("");
}

function renderZones(zones) {
  el.zonesList.innerHTML = zones.map(zone => `
    <div class="zone-row">
      <strong>Zone ${zone.zone_number}</strong>
      <div class="zone-bar"><div class="zone-fill" style="width:${Math.max(0, Math.min(100, zone.percent || 0))}%"></div></div>
      <span>${round(zone.percent, 0)}%</span>
    </div>
  `).join("");
}

function renderRoute(track) {
  if (!track.length) {
    el.routeMap.innerHTML = "";
    return;
  }
  const width = 900;
  const height = 360;
  const pad = 24;
  const lats = track.map(point => point.lat);
  const lons = track.map(point => point.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latRange = maxLat - minLat || 1;
  const lonRange = maxLon - minLon || 1;
  const scale = Math.min((width - pad * 2) / lonRange, (height - pad * 2) / latRange);
  const routeWidth = lonRange * scale;
  const routeHeight = latRange * scale;
  const offsetX = (width - routeWidth) / 2;
  const offsetY = (height - routeHeight) / 2;
  const points = track.map(point => {
    const x = offsetX + (point.lon - minLon) * scale;
    const y = offsetY + (maxLat - point.lat) * scale;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const start = points.split(" ")[0];
  const end = points.split(" ").at(-1);
  el.routeMap.innerHTML = `
    <rect x="0" y="0" width="${width}" height="${height}" fill="#e9eef0"></rect>
    <polyline points="${points}" fill="none" stroke="#257c5a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></polyline>
    <circle cx="${start.split(",")[0]}" cy="${start.split(",")[1]}" r="7" fill="#2f6fb0"></circle>
    <circle cx="${end.split(",")[0]}" cy="${end.split(",")[1]}" r="7" fill="#b2473f"></circle>
  `;
}

function renderLapsChart(laps) {
  const canvas = el.lapsChart;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  if (!laps.length) return;

  const values = laps.map(lap => lap.avg_pace_seconds_per_km).filter(value => value);
  const min = Math.min(...values) - 8;
  const max = Math.max(...values) + 8;
  const left = 46;
  const right = 20;
  const top = 18;
  const bottom = 36;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  ctx.strokeStyle = "#dce3e6";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(width - right, y);
    ctx.stroke();
  }

  const barW = plotW / laps.length * 0.68;
  laps.forEach((lap, index) => {
    const value = lap.avg_pace_seconds_per_km || max;
    const x = left + index * (plotW / laps.length) + (plotW / laps.length - barW) / 2;
    const barH = ((max - value) / (max - min)) * plotH;
    const y = top + plotH - barH;
    ctx.fillStyle = index % 2 ? "#2f6fb0" : "#257c5a";
    ctx.fillRect(x, y, barW, barH);
  });

  ctx.fillStyle = "#65737a";
  ctx.font = "13px system-ui";
  ctx.fillText("Faster", 4, top + 10);
  ctx.fillText("Slower", 4, height - bottom);
}

function renderSegments(segments) {
  el.segmentsTable.innerHTML = segments.map(segment => `
    <tr>
      <td>${segment.name || "--"}</td>
      <td>${formatSeconds(segment.time_seconds)}</td>
      <td>${formatPace(segment.pace_seconds_per_km)}</td>
    </tr>
  `).join("");
}

init().catch(error => {
  document.body.innerHTML = `<pre>${error.stack || error}</pre>`;
});
