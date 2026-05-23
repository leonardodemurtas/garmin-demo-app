const app = document.querySelector("#app");

const state = {
  summary: null,
  provenance: null,
  activities: [],
  detailCache: new Map(),
  charts: [],
  map: null,
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
  disposeMap();
  const latestActivity = state.activities[0];
  const latestDetail = latestActivity ? await loadDetail(latestActivity.id) : null;
  renderShell({ mode: "list", content: overviewTemplate(latestDetail) });
  bindAgentRunRead();
}

async function renderDetail(id) {
  disposeCharts();
  disposeMap();
  const detail = await loadDetail(id);
  renderShell({ mode: "detail", content: detailTemplate(detail) });
  renderLeafletMap(detail.track);
  renderDetailCharts(detail);
  bindCollapsibles();
  bindAgentRunRead();
}

function renderShell({ mode, content }) {
  app.className = "";
  const cls = mode === "list" ? "list-shell" : "detail-shell";
  app.innerHTML = `<div class="${cls}">${content}</div>`;
  bindNavigation();
}

// ---------- Page 1: Run List ----------

function overviewTemplate(latestDetail) {
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

    <div class="run-list">
      ${latestDetail ? agentRunReadCard(buildRecentAgentRunRead(latestDetail), "list-agent-read-card") : ""}
      ${state.activities.map(runTile).join("")}
    </div>
  `;
}

function runTile(activity) {
  return `
    <button class="run-tile" data-route="/runs/${escapeAttr(activity.id)}">
      <span class="run-chip">${escapeHTML(activity.type || "Run")}</span>
      <div class="run-tile-name">${escapeHTML(activity.name)}</div>
      <span class="run-tile-date">${formatDate(activity.activity_date)}</span>
      <div class="run-tile-stats">
        ${runTileStat("Distance", formatDistance(activity.distance_km))}
        ${runTileStat("Time", formatSeconds(activity.duration_seconds))}
        ${runTileStat("Pace", formatPace(activity.avg_pace_seconds_per_km))}
        ${runTileStat("Avg HR", formatBpm(activity.avg_hr_bpm))}
      </div>
      <span class="run-tile-arrow" aria-hidden="true">&#8250;</span>
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
      <a class="back-btn" href="/runs" data-route="/runs">&#8592;</a>
      <h1 class="page-title">${escapeHTML(activity.name)}</h1>
      <span class="toolbar-date">${formatDate(activity.activity_date)}</span>
    </div>

    <div class="detail-spread">

      <div class="left-col stack">
        <section class="panel zones-panel">
          <div class="panel-title">
            <h2>Heart-rate zones</h2>
            <span>${zones.length} zones</span>
          </div>
          ${zoneList(zones)}
        </section>
        <div class="kpi-grid">
          ${metricCard("Avg HR", formatBpm(activity.avg_hr_bpm), "heart rate")}
          ${metricCard("Distance", formatDistance(activity.distance_km), "total")}
          ${metricCard("Time", formatSeconds(activity.duration_seconds), "elapsed")}
          ${metricCard("Pace", formatPace(activity.avg_pace_seconds_per_km), "average")}
          ${metricCard("Ascent", `${round(activity.total_ascent_m, 0)} m`, "gain")}
          ${metricCard("Cadence", formatSpm(activity.avg_run_cadence_spm), "average")}
        </div>
      </div>

      <div class="right-col stack">
        ${agentRunReadCard(buildActivityAgentRunRead(detail), "activity-agent-read-card")}
        <section class="panel collapsible">
          <div class="panel-title">
            <h2>Performance timeline</h2>
          </div>
          <div class="chart telemetry-chart" id="telemetryChart"></div>
        </section>
        <section class="panel collapsible">
          <div class="panel-title">
            <h2>Lap pace</h2>
            <span>${laps.length} laps</span>
          </div>
          <div class="chart laps-chart" id="lapsChart"></div>
        </section>
        <section class="table-panel collapsible">
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
        <section class="table-panel collapsible">
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
        <section class="panel collapsible">
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
  const detail = [
    provenance?.latest_capture ? `Latest capture ${formatDateTime(provenance.latest_capture)}` : "",
    provenance?.database ? `from ${provenance.database}.` : "",
  ].filter(Boolean).join(" ");
  const metrics = [
    ["Runs", provenance?.activity_count],
    ["GPS points", provenance?.track_point_count],
    ["Exports", provenance?.export_count],
    ["Bundles", provenance?.source_bundle_count],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");
  return `
    <section class="pipeline-strip" aria-label="Dashboard provenance">
      <span class="pipeline-copy">
        <span class="pipeline-flow">Garmin profile → generated CLI → SQLite → local dashboard</span>
        ${detail ? `<span class="pipeline-detail">${escapeHTML(detail)}</span>` : ""}
      </span>
      ${metrics.length ? `<span class="pipeline-stats">${metrics.map(([label, value]) => pipelineMetric(label, value)).join("")}</span>` : ""}
      <span class="pipeline-map-controls" aria-label="Map zoom controls">
        <button type="button" data-action="zoom-out" title="Zoom out">&#8722;</button>
        <button type="button" data-action="zoom-in" title="Zoom in">&#43;</button>
      </span>
    </section>
  `;
}

function agentRunReadCard(read, className = "") {
  return `
    <section class="agent-read-card ${escapeAttr(className)}" data-agent-read>
      <button class="agent-read-toggle" type="button" aria-expanded="false">
        <span class="agent-read-heading">
          <span class="agent-read-dot" aria-hidden="true"></span>
          <span class="agent-read-title">Agent run read</span>
          <span class="agent-read-chip">READ-ONLY</span>
        </span>
        <span class="agent-read-toggle-icon" aria-hidden="true">+</span>
      </button>
      <div class="agent-read-closed">
        <div class="agent-read-verdict">${escapeHTML(read.verdict)}</div>
        ${read.closedSummary ? `<p>${escapeHTML(read.closedSummary)}</p>` : ""}
        <div class="agent-read-meta">${escapeHTML(read.meta)}</div>
      </div>
      <div class="agent-read-expanded">
        <div class="agent-read-expanded-inner">
          <div class="agent-read-chip-row">
            ${read.chips.map((chip) => `<span class="agent-read-chip">${escapeHTML(chip)}</span>`).join("")}
          </div>
          <div class="agent-read-verdict">${escapeHTML(read.verdict)}</div>
          ${read.openSummary ? `<p class="agent-read-summary">${escapeHTML(read.openSummary)}</p>` : ""}
          ${read.sections.map(agentReadSectionBlock).join("")}
        </div>
      </div>
    </section>
  `;
}

function agentReadSectionBlock(section) {
  if (section.type === "metrics") {
    const visibleItems = section.items.filter((item) => item.value);
    if (!visibleItems.length && !section.note) return "";
    return `
      <div class="agent-read-section">
        <h3>${escapeHTML(section.title)}</h3>
        ${visibleItems.length ? `
          <div class="agent-read-metrics">
            ${visibleItems.map((item) => `
              <span class="agent-read-metric">
                <strong>${escapeHTML(item.value)}</strong>
                <span>${escapeHTML(item.label)}</span>
              </span>
            `).join("")}
          </div>
        ` : ""}
        ${section.note ? `<p>${escapeHTML(section.note)}</p>` : ""}
      </div>
    `;
  }
  if (section.type === "text") {
    const paragraphs = section.paragraphs.filter(Boolean);
    if (!paragraphs.length) return "";
    return `
      <div class="agent-read-section">
        <h3>${escapeHTML(section.title)}</h3>
        ${paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
      </div>
    `;
  }
  if (section.type === "callout") {
    if (!section.body) return "";
    return `
      <div class="agent-read-section">
        <h3>${escapeHTML(section.title)}</h3>
        <p class="agent-read-next">${escapeHTML(section.body)}</p>
      </div>
    `;
  }
  if (section.type === "boundary") {
    return `
      <div class="agent-read-section agent-read-boundary">
        <h3>${escapeHTML(section.title)}</h3>
        ${section.summary ? `<p>${escapeHTML(section.summary)}</p>` : ""}
        <div class="agent-boundary-list">
          ${section.items.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}
        </div>
      </div>
    `;
  }
  return agentReadListSection(section.title, section.items || [], section.body);
}

function agentReadListSection(title, items, body = "") {
  const visibleItems = items.filter(Boolean);
  if (!visibleItems.length && !body) return "";
  return `
    <div class="agent-read-section">
      <h3>${escapeHTML(title)}</h3>
      ${body ? `<p>${escapeHTML(body)}</p>` : ""}
      ${visibleItems.length ? `
        <ul>
          ${visibleItems.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `;
}

function buildRecentAgentRunRead(detail) {
  const activity = detail.activity;
  const zones = detail.zones || [];
  const recent = state.activities || [];
  const previous = previousActivity(activity, recent);
  const z2 = zonePercent(zones, 2);
  const z4 = zonePercent(zones, 4);
  const z5 = zonePercent(zones, 5);
  const distance = valueOrEmpty(formatDistance(activity.distance_km));
  const pace = compactPace(activity.avg_pace_seconds_per_km);
  const avgHr = activity.avg_hr_bpm;
  const cadence = activity.avg_run_cadence_spm;
  const ascent = activity.total_ascent_m;
  const recentCount = recent.length || state.summary?.activity_count || 0;
  const contextLabel = recentCount ? `${recentCount}-run context` : "recent context";
  const meta = recentCount ? `Generated from latest activity + last ${recentCount} runs` : "Generated from latest activity + recent runs";

  return {
    verdict: "Controlled aerobic build",
    closedSummary: closedRecentAgentSummary(distance, pace, z2, avgHr),
    openSummary: openRecentAgentSummary(distance, pace, z2, z4, z5),
    meta,
    chips: ["READ-ONLY", contextLabel, "Garmin data"],
    sections: [
      { title: "What happened", items: whatHappenedItems(activity, previous, cadence, ascent) },
      { title: "Pattern detected", items: patternItems(recent, state.summary) },
      {
        type: "callout",
        title: "Next best move",
        body: "Do not stack another medium-long steady run tomorrow. Either take an easy recovery day, or make the next quality session clearly different: shorter, sharper, and intentionally higher intensity.",
      },
      agentBoundarySection("Generated from Garmin activity data and recent run history."),
    ],
  };
}

function buildActivityAgentRunRead(detail) {
  const activity = detail.activity;
  const zones = detail.zones || [];
  const z2 = zonePercent(zones, 2);
  const z3 = zonePercent(zones, 3);
  const z4 = zonePercent(zones, 4);
  const z5 = zonePercent(zones, 5);
  const distance = valueOrEmpty(formatDistance(activity.distance_km));
  const pace = compactPace(activity.avg_pace_seconds_per_km);
  const avgHr = activity.avg_hr_bpm;
  const cadence = activity.avg_run_cadence_spm;
  const ascent = activity.total_ascent_m;

  return {
    verdict: "Steady Z2 aerobic run",
    closedSummary: closedActivityAgentSummary(distance, pace, z2),
    openSummary: openActivityAgentSummary(activity, pace, avgHr, z2, z4, z5),
    meta: "Generated from this activity",
    chips: ["READ-ONLY", "This activity", "Garmin data"],
    sections: [
      {
        type: "metrics",
        title: "Run overview",
        items: activityOverviewMetrics(activity),
        note: routeReadNote(ascent),
      },
      {
        title: "Effort read",
        body: effortReadCopy(z2, z3, z4, z5),
        items: effortReadItems(z2, z3, z4, z5),
      },
      { title: "What went well", items: whatWentWellItems(activity, z2, z4, z5) },
      {
        type: "text",
        title: "Watch next time",
        paragraphs: watchNextTimeItems(z2, z3),
      },
      {
        type: "callout",
        title: "Next best move",
        body: "Treat this as a successful aerobic build session. The next run should either be clearly easier for recovery, or clearly different if quality is planned. Avoid turning the next session into another medium-hard steady run by default.",
      },
      agentBoundarySection("Generated from the selected Garmin activity."),
    ],
  };
}

function agentBoundarySection(summary) {
  return {
    type: "boundary",
    title: "Agent boundary",
    summary,
    items: ["Read-only analysis", "No activity edits", "No workout changes", "No schedule changes"],
  };
}

function closedRecentAgentSummary(distance, pace, z2, avgHr) {
  if (!distance || !pace) return "";
  const zonePhrase = Number.isFinite(z2) ? "mostly Z2" : "a recorded aerobic profile";
  const hrPhrase = avgHr ? "with stable heart rate" : "with recorded effort data";
  return `${distance} at ${pace}, ${zonePhrase}, ${hrPhrase}.`;
}

function openRecentAgentSummary(distance, pace, z2, z4, z5) {
  if (!distance || !pace) return "";
  const zonePhrase = Number.isFinite(z2) ? `, with ${z2}% of the run in Z2` : "";
  const noHardZones = z4 === 0 && z5 === 0 ? " and no time in Z4/Z5" : "";
  return `${distance} at ${pace}${zonePhrase}${noHardZones}. This reads as a steady aerobic session, not a maximal effort.`;
}

function closedActivityAgentSummary(distance, pace, z2) {
  if (!distance || !pace) return "";
  const zonePhrase = Number.isFinite(z2) ? "with most of the effort held in Z2" : "from the selected Garmin activity";
  return `${distance} at ${pace}, ${zonePhrase}.`;
}

function openActivityAgentSummary(activity, pace, avgHr, z2, z4, z5) {
  const distance = activity.distance_km ? `${round(activity.distance_km, 0)} km` : "recorded";
  const evidence = [
    pace ? `${pace} average pace` : "",
    avgHr ? `${formatBpm(avgHr)} average heart rate` : "",
    Number.isFinite(z2) ? `${z2}% of time in Z2` : "",
  ].filter(Boolean);
  const opening = evidence.length
    ? `This was a controlled ${distance} aerobic session: ${joinSentenceList(evidence)}.`
    : `This was a controlled aerobic session recorded from Garmin activity data.`;
  const noHardZones = z4 === 0 && z5 === 0
    ? " The absence of Z4/Z5 work supports the intent: durable effort, not a hard session."
    : "";
  return `${opening}${noHardZones}`;
}

function activityOverviewMetrics(activity) {
  return [
    { label: "Distance", value: valueOrEmpty(formatDistance(activity.distance_km)) },
    { label: "Time", value: valueOrEmpty(formatSeconds(activity.duration_seconds)) },
    { label: "Pace", value: compactPace(activity.avg_pace_seconds_per_km) },
    { label: "Avg HR", value: activity.avg_hr_bpm ? `${formatBpm(activity.avg_hr_bpm)} avg HR` : "" },
    { label: "Cadence", value: activity.avg_run_cadence_spm ? `${formatSpm(activity.avg_run_cadence_spm)} cadence` : "" },
    { label: "Ascent", value: activity.total_ascent_m !== null && activity.total_ascent_m !== undefined ? `${round(activity.total_ascent_m, 0)} m ascent` : "" },
  ];
}

function routeReadNote(ascent) {
  if (ascent === null || ascent === undefined) return "";
  if (Number(ascent) <= 60) return "Flat route profile makes the pace and heart-rate relationship easier to read.";
  return "";
}

function effortReadItems(z2, z3, z4, z5) {
  const items = [];
  if (Number.isFinite(z2)) items.push(`Z2 carried the session: ${z2}%`);
  if (Number.isFinite(z3) && z3 > 0) items.push(`Z3 appeared but stayed contained: ${z3}%`);
  if (z4 === 0 && z5 === 0) items.push("No Z4/Z5 time recorded");
  if (Number.isFinite(z2) && z2 >= 60) items.push("Signal: aerobic control held for most of the run");
  return items;
}

function effortReadCopy(z2, z3, z4, z5) {
  if (!Number.isFinite(z2)) return "";
  const drift = Number.isFinite(z3) && z3 > 0
    ? " The Z3 portion suggests some drift or a few stronger sections,"
    : "";
  const threshold = z4 === 0 && z5 === 0
    ? " but there is no sign that the session turned into threshold work."
    : ".";
  return `The run mostly stayed where a Z2 session should live.${drift}${threshold}`;
}

function whatWentWellItems(activity, z2, z4, z5) {
  const items = [];
  if (Number.isFinite(z2) && z2 >= 60 && z4 === 0 && z5 === 0) {
    items.push("Strong aerobic volume without high-intensity spillover");
  }
  if (activity.avg_pace_seconds_per_km && activity.avg_hr_bpm) {
    items.push("Efficient pace for the recorded heart rate");
  }
  if (activity.avg_run_cadence_spm) {
    items.push("High cadence suggests a quick, compact stride");
  }
  if (activity.total_ascent_m !== null && activity.total_ascent_m !== undefined && Number(activity.total_ascent_m) <= 60) {
    items.push("Low climb reduced route noise in the effort read");
  }
  return items;
}

function watchNextTimeItems(z2, z3) {
  const items = [];
  if (Number.isFinite(z2) && Number.isFinite(z3) && z3 > 0) {
    items.push("If this was intended as a pure Z2 day, the only thing to watch is the Z3 drift. Keep the middle and final third slightly easier, or use heart rate as the cap instead of pace.");
  }
  items.push("If the goal was aerobic strength rather than strict recovery, this was well controlled.");
  return items;
}

function joinSentenceList(items) {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function whatHappenedItems(activity, previous, cadence, ascent) {
  const items = [];
  if (previous && activity.avg_pace_seconds_per_km && previous.avg_pace_seconds_per_km && previous.distance_km) {
    const delta = Math.round(previous.avg_pace_seconds_per_km - activity.avg_pace_seconds_per_km);
    if (delta > 0) {
      items.push(`Faster than ${relativeRunLabel(activity, previous)} ${formatDistance(previous.distance_km)} run by ${delta} sec/km`);
    } else if (delta < 0) {
      items.push(`Slower than ${relativeRunLabel(activity, previous)} ${formatDistance(previous.distance_km)} run by ${Math.abs(delta)} sec/km`);
    }
  }
  if (previous && activity.avg_hr_bpm && previous.avg_hr_bpm) {
    if (activity.avg_hr_bpm === previous.avg_hr_bpm) {
      items.push(`Average HR matched ${relativeRunTimeLabel(activity, previous)} at ${formatBpm(activity.avg_hr_bpm)}`);
    } else {
      items.push(`Average HR stayed close to ${relativeRunTimeLabel(activity, previous)}: ${formatBpm(activity.avg_hr_bpm)} vs ${formatBpm(previous.avg_hr_bpm)}`);
    }
  }
  if (cadence) items.push(`Cadence stayed high at ${formatSpm(cadence)}`);
  if (ascent !== null && ascent !== undefined) items.push(`Low climb: ${round(ascent, 0)} m, so pace comparison is meaningful`);
  return items;
}

function patternItems(recent, summary) {
  const items = [];
  const activityCount = summary?.activity_count || recent.length;
  if (activityCount && summary?.total_distance_km && summary?.first_date && summary?.last_date) {
    items.push(`${round(summary.total_distance_km, 1)} km across ${activityCount} runs in ${dateSpanDays(summary.first_date, summary.last_date)} days`);
  }
  const hrValues = recent.map((activity) => activity.avg_hr_bpm).filter((value) => value !== null && value !== undefined);
  if (hrValues.length) {
    items.push(`Average HR stayed tightly grouped: ${Math.min(...hrValues)}-${Math.max(...hrValues)} bpm`);
  }
  const paceValues = recent.map((activity) => activity.avg_pace_seconds_per_km).filter((value) => value !== null && value !== undefined);
  if (paceValues.length) {
    items.push(`Pace stayed tightly grouped: ${paceRangeLabel(Math.min(...paceValues), Math.max(...paceValues))}`);
  }
  if (hrValues.length && paceValues.length) {
    items.push("Signal: strong aerobic consistency, but little intensity separation");
  }
  return items;
}

function previousActivity(activity, recent) {
  const currentDate = activity.activity_date;
  return [...recent]
    .filter((item) => item.id !== activity.id && item.activity_date < currentDate)
    .sort((a, b) => b.activity_date.localeCompare(a.activity_date))[0] || null;
}

function relativeRunLabel(activity, previous) {
  return dateSpanDays(previous.activity_date, activity.activity_date) === 2 ? "yesterday's" : "the previous";
}

function relativeRunTimeLabel(activity, previous) {
  return dateSpanDays(previous.activity_date, activity.activity_date) === 2 ? "yesterday" : "the previous run";
}

function zonePercent(zones, zoneNumber) {
  const zone = zones.find((item) => Number(item.zone_number) === zoneNumber);
  const percent = Number(zone?.percent);
  return Number.isFinite(percent) ? Math.round(percent) : null;
}

function compactPace(value) {
  const pace = formatPace(value);
  return pace === "--" ? "" : pace.replace(" /km", "/km");
}

function paceRangeLabel(fastest, slowest) {
  const fast = compactPace(fastest).replace("/km", "");
  const slow = compactPace(slowest);
  return fast && slow ? `${fast}-${slow}` : "";
}

function valueOrEmpty(value) {
  return value === "--" ? "" : value;
}

function dateSpanDays(firstDate, lastDate) {
  if (!firstDate || !lastDate) return 0;
  const first = new Date(`${firstDate}T00:00:00`);
  const last = new Date(`${lastDate}T00:00:00`);
  return Math.max(1, Math.round((last - first) / 86400000) + 1);
}

function zoneList(zones) {
  const ordered = [...zones].sort((a, b) => a.zone_number - b.zone_number);
  const maxZone = Math.max(...ordered.map((zone) => Number(zone.zone_number) || 0));
  return `
    <div class="zones-list">
      ${ordered.map((zone) => zoneRow(zone, maxZone)).join("")}
    </div>
  `;
}

function zoneRow(zone, maxZone) {
  const percent = Math.max(0, Math.min(100, Number(zone.percent) || 0));
  return `
    <div class="zone-row" style="--zone-width: ${percent}%; --zone-color: ${escapeAttr(zoneColor(zone, maxZone))};">
      <span class="zone-label">Z${escapeHTML(zone.zone_number ?? "")}</span>
      <span class="zone-track"><span></span></span>
      <span class="zone-percent">${round(percent, 0)}%</span>
    </div>
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
    <span class="pipeline-metric">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(formatInteger(value))}</strong>
    </span>
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
  renderTelemetryChart("telemetryChart", detail.track);
  renderLapsChart("lapsChart", detail.laps);
}

function chart(id) {
  const node = document.getElementById(id);
  if (!node || typeof echarts === "undefined") return null;
  const instance = echarts.init(node, null, { renderer: "canvas" });
  state.charts.push(instance);
  return instance;
}

function bindCollapsibles() {
  document.querySelectorAll(".collapsible").forEach((panel) => {
    panel.classList.add("is-collapsed");
    const title = panel.querySelector(".panel-title");
    if (!title) return;
    title.style.cursor = "pointer";
    title.addEventListener("click", () => {
      const nowCollapsed = panel.classList.toggle("is-collapsed");
      if (!nowCollapsed) state.charts.forEach((c) => c.resize());
    });
  });
}

function bindAgentRunRead() {
  document.querySelectorAll("[data-agent-read]").forEach((card) => {
    const toggle = card.querySelector(".agent-read-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setAgentReadOpen(card, !card.classList.contains("is-open"));
    });
    card.addEventListener("click", () => {
      if (!card.classList.contains("is-open")) setAgentReadOpen(card, true);
    });
  });
}

function setAgentReadOpen(card, open) {
  card.classList.toggle("is-open", open);
  const toggle = card.querySelector(".agent-read-toggle");
  const icon = card.querySelector(".agent-read-toggle-icon");
  if (toggle) toggle.setAttribute("aria-expanded", String(open));
  if (icon) icon.textContent = open ? "-" : "+";
}

function disposeCharts() {
  state.charts.forEach((instance) => instance.dispose());
  state.charts = [];
}

function disposeMap() {
  if (state.map) {
    state.map.remove();
    state.map = null;
  }
  document.getElementById("map-bg")?.remove();
  document.getElementById("map-controls")?.remove();
}

function renderLeafletMap(track) {
  let mapEl = document.getElementById("map-bg");
  if (!mapEl) {
    mapEl = document.createElement("div");
    mapEl.id = "map-bg";
    document.body.prepend(mapEl);
  }
  if (!track || !track.length) return;

  const coords = track.map((p) => [p.lat, p.lon]);
  const map = L.map("map-bg", {
    zoomControl: false,
    attributionControl: true,
    dragging: true,
    scrollWheelZoom: false,
    keyboard: false,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  const poly = L.polyline(coords, {
    color: "#FF7133",
    weight: 3.5,
    opacity: 0.9,
  }).addTo(map);

  map.fitBounds(poly.getBounds(), {
    paddingTopLeft: [295, 100],
    paddingBottomRight: [280, 160],
  });
  state.map = map;
  createMapControls(map);
}

function createMapControls(map) {
  const el = document.querySelector(".pipeline-map-controls");
  if (!el) return;
  el.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    e.stopPropagation();
    switch (btn.dataset.action) {
      case "zoom-in":  map.zoomIn();         break;
      case "zoom-out": map.zoomOut();        break;
    }
  });
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
    legend: { top: 0, left: "center", ...legendBase, itemGap: 16 },
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
  const ordered = [...zones].sort((a, b) => a.zone_number - b.zone_number);
  const maxZone = Math.max(...ordered.map((zone) => Number(zone.zone_number) || 0));
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
    grid: { left: 48, right: 30, top: 12, bottom: 24 },
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
        data: ordered.map((zone) => ({
          value: zone.percent || 0,
          itemStyle: { color: zoneColor(zone, maxZone) },
        })),
        barMaxWidth: 14,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
      },
    ],
  });
}

function zoneColor(zone, maxZone) {
  const zoneNumber = Number(zone.zone_number) || maxZone;
  const index = Math.max(0, Math.min(chartColors.zoneRamp.length - 1, maxZone - zoneNumber));
  return chartColors.zoneRamp[index];
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
