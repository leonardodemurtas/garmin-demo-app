#!/usr/bin/env python3
import csv
import io
import json
import math
import re
import sqlite3
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "source-data"
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "garmin_demo.sqlite"


SCHEMA = """
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS exports;
DROP TABLE IF EXISTS track_points;
DROP TABLE IF EXISTS heart_rate_zones;
DROP TABLE IF EXISTS segments;
DROP TABLE IF EXISTS laps;
DROP TABLE IF EXISTS activities;

CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  activity_date TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  captured_at TEXT,
  visible_date_time TEXT,
  distance_km REAL,
  duration_seconds INTEGER,
  avg_pace_seconds_per_km REAL,
  total_ascent_m REAL,
  total_descent_m REAL,
  calories INTEGER,
  resting_calories INTEGER,
  active_calories INTEGER,
  avg_hr_bpm INTEGER,
  max_hr_bpm INTEGER,
  moving_time_seconds INTEGER,
  elapsed_time_seconds INTEGER,
  min_elevation_m REAL,
  max_elevation_m REAL,
  avg_run_cadence_spm INTEGER,
  max_run_cadence_spm INTEGER,
  avg_stride_length_m REAL,
  device_name TEXT,
  device_software TEXT,
  summary_data TEXT,
  gear_name TEXT,
  gear_model TEXT,
  gear_usage TEXT,
  gear_distance TEXT,
  weather_temperature TEXT,
  weather_wind TEXT,
  raw_capture_json TEXT NOT NULL
);

CREATE TABLE laps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  lap_number INTEGER,
  time_seconds REAL,
  cumulative_time_seconds REAL,
  distance_km REAL,
  avg_pace_seconds_per_km REAL,
  avg_hr_bpm INTEGER,
  max_hr_bpm INTEGER,
  total_ascent_m REAL,
  total_descent_m REAL,
  calories INTEGER,
  avg_run_cadence_spm INTEGER,
  avg_stride_length_m REAL,
  best_pace_seconds_per_km REAL,
  max_run_cadence_spm INTEGER,
  moving_time_seconds REAL,
  avg_moving_pace_seconds_per_km REAL,
  raw_json TEXT NOT NULL
);

CREATE TABLE segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  rank TEXT,
  name TEXT,
  time_seconds REAL,
  pace_seconds_per_km REAL,
  raw_json TEXT NOT NULL
);

CREATE TABLE heart_rate_zones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  zone_number INTEGER,
  label TEXT NOT NULL,
  bpm_range TEXT,
  effort TEXT,
  time_seconds REAL,
  percent REAL,
  raw_json TEXT NOT NULL
);

CREATE TABLE track_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  elevation_m REAL,
  point_time TEXT,
  hr_bpm INTEGER,
  cadence_spm INTEGER
);

CREATE TABLE exports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  payload BLOB NOT NULL
);

CREATE INDEX idx_track_points_activity_seq ON track_points(activity_id, sequence);
CREATE INDEX idx_laps_activity ON laps(activity_id, lap_number);
CREATE INDEX idx_segments_activity ON segments(activity_id);
CREATE INDEX idx_zones_activity ON heart_rate_zones(activity_id, zone_number);
"""


def clean_text(value):
    return str(value or "").replace("\xa0", " ").strip()


def locale_number(value):
    text = clean_text(value)
    if not text or text == "--":
        return None
    match = re.search(r"-?\d[\d.,]*", text)
    if not match:
        return None
    number = match.group(0)
    if "," in number:
        number = number.replace(".", "").replace(",", ".")
    try:
        return float(number)
    except ValueError:
        return None


def integer_value(value):
    number = locale_number(value)
    if number is None:
        return None
    return int(round(number))


def duration_seconds(value):
    text = clean_text(value)
    if not text or text == "--":
        return None
    text = text.replace(" min", "").replace("/km", "").strip()
    parts = text.split(":")
    try:
        if len(parts) == 3:
            hours = float(parts[0])
            minutes = float(parts[1])
            seconds = float(parts[2].replace(",", "."))
            return hours * 3600 + minutes * 60 + seconds
        if len(parts) == 2:
            minutes = float(parts[0])
            seconds = float(parts[1].replace(",", "."))
            return minutes * 60 + seconds
    except ValueError:
        return None
    return locale_number(text)


def pace_seconds(value):
    return duration_seconds(clean_text(value).replace(" /km", "").replace("\xa0/km", ""))


def percent_value(value):
    number = locale_number(clean_text(value).replace("%", ""))
    return number


def table_rows(table):
    headers = table.get("headers") or []
    rows = []
    for row in table.get("rows") or []:
        rows.append({headers[i] if i < len(headers) else f"field_{i}": cell for i, cell in enumerate(row)})
    return rows


def find_member(names, suffix):
    return next((name for name in names if name.endswith(suffix)), None)


def export_kind(filename):
    lower = filename.lower()
    if lower.endswith(".gpx"):
        return "gpx"
    if lower.endswith(".tcx"):
        return "tcx"
    if lower.endswith(".csv"):
        return "splits_csv"
    if lower.endswith(".zip"):
        return "original_fit_zip"
    return "file"


def mime_type(filename):
    lower = filename.lower()
    if lower.endswith(".gpx") or lower.endswith(".tcx"):
        return "application/xml"
    if lower.endswith(".csv"):
        return "text/csv"
    if lower.endswith(".zip"):
        return "application/zip"
    return "application/octet-stream"


def parse_zone(zone):
    label = clean_text(zone.get("zone"))
    number_match = re.search(r"Zone\s+(\d+)", label)
    range_match = re.search(r"Zone\s+\d+\s+(.+?)(?:\s+.\s+|\s+-\s+|\s+Maximum|\s+Threshold|\s+Aerobic|\s+Easy|\s+Warm Up|$)", label)
    effort = ""
    if "Maximum" in label:
        effort = "Maximum"
    elif "Threshold" in label:
        effort = "Threshold"
    elif "Aerobic" in label:
        effort = "Aerobic"
    elif "Easy" in label:
        effort = "Easy"
    elif "Warm Up" in label:
        effort = "Warm Up"
    return {
        "zone_number": int(number_match.group(1)) if number_match else None,
        "label": label,
        "bpm_range": clean_text(range_match.group(1)) if range_match else "",
        "effort": effort,
        "time_seconds": duration_seconds(zone.get("time")),
        "percent": percent_value(zone.get("percent")),
        "raw_json": json.dumps(zone, ensure_ascii=False),
    }


def parse_gpx_points(gpx_bytes):
    if not gpx_bytes:
        return []
    root = ET.fromstring(gpx_bytes)
    ns = {
        "gpx": "http://www.topografix.com/GPX/1/1",
        "gpxtpx": "http://www.garmin.com/xmlschemas/TrackPointExtension/v1",
    }
    points = []
    for sequence, trkpt in enumerate(root.findall(".//gpx:trkpt", ns), start=1):
        def text_of(path):
            item = trkpt.find(path, ns)
            return item.text if item is not None else None

        points.append(
            {
                "sequence": sequence,
                "lat": float(trkpt.attrib["lat"]),
                "lon": float(trkpt.attrib["lon"]),
                "elevation_m": locale_number(text_of("gpx:ele")),
                "point_time": text_of("gpx:time"),
                "hr_bpm": integer_value(text_of(".//gpxtpx:hr")),
                "cadence_spm": integer_value(text_of(".//gpxtpx:cad")),
            }
        )
    return points


def import_bundle(conn, bundle_path):
    with zipfile.ZipFile(bundle_path) as zf:
        names = zf.namelist()
        json_name = find_member(names, ".json")
        gpx_name = find_member(names, ".gpx")
        capture = json.loads(zf.read(json_name))
        activity = capture["activity_list_row"]
        activity_id = activity["id"]
        parsed = capture.get("parsed", {})
        overview = parsed.get("overview", {})
        summary = overview.get("summary", {})
        stats = parsed.get("activity_stats", {})
        device = overview.get("device", {})
        gear = overview.get("gear", {})
        weather = overview.get("weather", {})

        conn.execute(
            """
            INSERT INTO activities (
              id, activity_date, name, type, url, captured_at, visible_date_time,
              distance_km, duration_seconds, avg_pace_seconds_per_km, total_ascent_m,
              total_descent_m, calories, resting_calories, active_calories,
              avg_hr_bpm, max_hr_bpm, moving_time_seconds, elapsed_time_seconds,
              min_elevation_m, max_elevation_m, avg_run_cadence_spm,
              max_run_cadence_spm, avg_stride_length_m, device_name,
              device_software, summary_data, gear_name, gear_model, gear_usage,
              gear_distance, weather_temperature, weather_wind, raw_capture_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                activity_id,
                activity["date"],
                activity["name"],
                activity["type"],
                activity["url"],
                capture.get("captured_at"),
                overview.get("visible_date_time"),
                locale_number(summary.get("Distance") or activity.get("distance")),
                duration_seconds(summary.get("Time") or activity.get("time")),
                pace_seconds(summary.get("Avg Pace") or activity.get("avg_pace")),
                locale_number(summary.get("Total Ascent") or activity.get("total_ascent")),
                locale_number(stats.get("Total Descent")),
                integer_value(summary.get("Calories")),
                integer_value(stats.get("Resting Calories")),
                integer_value(stats.get("Active Calories")),
                integer_value(stats.get("Avg HR") or activity.get("avg_hr")),
                integer_value(stats.get("Max HR")),
                duration_seconds(stats.get("Moving Time")),
                duration_seconds(stats.get("Elapsed Time")),
                locale_number(stats.get("Min Elev")),
                locale_number(stats.get("Max Elev")),
                integer_value(stats.get("Avg Run Cadence")),
                integer_value(stats.get("Max Run Cadence")),
                locale_number(stats.get("Avg Stride Length")),
                device.get("name"),
                device.get("software"),
                device.get("summary_data"),
                gear.get("name"),
                gear.get("model"),
                gear.get("usage"),
                gear.get("distance"),
                weather.get("temperature"),
                weather.get("wind"),
                json.dumps(capture, ensure_ascii=False),
            ),
        )

        laps_table = next(iter(capture.get("tabs", {}).get("laps", {}).get("tables", [])), {})
        for lap in table_rows(laps_table):
            conn.execute(
                """
                INSERT INTO laps (
                  activity_id, lap_number, time_seconds, cumulative_time_seconds,
                  distance_km, avg_pace_seconds_per_km, avg_hr_bpm, max_hr_bpm,
                  total_ascent_m, total_descent_m, calories, avg_run_cadence_spm,
                  avg_stride_length_m, best_pace_seconds_per_km, max_run_cadence_spm,
                  moving_time_seconds, avg_moving_pace_seconds_per_km, raw_json
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    activity_id,
                    integer_value(lap.get("Laps")),
                    duration_seconds(lap.get("Time")),
                    duration_seconds(lap.get("Cumulative Time")),
                    locale_number(lap.get("Distance")),
                    pace_seconds(lap.get("Avg Pace")),
                    integer_value(lap.get("Avg HR")),
                    integer_value(lap.get("Max HR")),
                    locale_number(lap.get("Total Ascent")),
                    locale_number(lap.get("Total Descent")),
                    integer_value(lap.get("Calories")),
                    integer_value(lap.get("Avg Run Cadence")),
                    locale_number(lap.get("Avg Stride Length")),
                    pace_seconds(lap.get("Best Pace")),
                    integer_value(lap.get("Max Run Cadence")),
                    duration_seconds(lap.get("Moving Time")),
                    pace_seconds(lap.get("Avg Moving Pace")),
                    json.dumps(lap, ensure_ascii=False),
                ),
            )

        segments_table = next(iter(capture.get("tabs", {}).get("segments", {}).get("tables", [])), {})
        for segment in table_rows(segments_table):
            conn.execute(
                "INSERT INTO segments (activity_id, rank, name, time_seconds, pace_seconds_per_km, raw_json) VALUES (?, ?, ?, ?, ?, ?)",
                (
                    activity_id,
                    clean_text(segment.get("Rank")),
                    clean_text(segment.get("Segment Name")),
                    duration_seconds(segment.get("Time")),
                    pace_seconds(segment.get("Pace")),
                    json.dumps(segment, ensure_ascii=False),
                ),
            )

        zones = capture.get("tabs", {}).get("time_in_zones", {}).get("parsed", {}).get("heart_rate_zones")
        if not zones:
            zones = parsed.get("heart_rate_zones", [])
        for zone in zones:
            parsed_zone = parse_zone(zone)
            conn.execute(
                "INSERT INTO heart_rate_zones (activity_id, zone_number, label, bpm_range, effort, time_seconds, percent, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    activity_id,
                    parsed_zone["zone_number"],
                    parsed_zone["label"],
                    parsed_zone["bpm_range"],
                    parsed_zone["effort"],
                    parsed_zone["time_seconds"],
                    parsed_zone["percent"],
                    parsed_zone["raw_json"],
                ),
            )

        gpx_bytes = zf.read(gpx_name) if gpx_name else b""
        for point in parse_gpx_points(gpx_bytes):
            conn.execute(
                "INSERT INTO track_points (activity_id, sequence, lat, lon, elevation_m, point_time, hr_bpm, cadence_spm) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    activity_id,
                    point["sequence"],
                    point["lat"],
                    point["lon"],
                    point["elevation_m"],
                    point["point_time"],
                    point["hr_bpm"],
                    point["cadence_spm"],
                ),
            )

        for name in names:
            if "/exports/" not in name or name.endswith("/"):
                continue
            payload = zf.read(name)
            filename = Path(name).name
            conn.execute(
                "INSERT INTO exports (activity_id, kind, filename, mime_type, byte_size, payload) VALUES (?, ?, ?, ?, ?, ?)",
                (activity_id, export_kind(filename), filename, mime_type(filename), len(payload), payload),
            )


def main():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if DB_PATH.exists():
        DB_PATH.unlink()
    bundles = sorted(SOURCE_DIR.glob("garmin-activity-*.zip"))
    if not bundles:
        raise SystemExit(f"No Garmin bundles found in {SOURCE_DIR}")
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript(SCHEMA)
        for bundle in bundles:
            import_bundle(conn, bundle)
        conn.commit()

        totals = conn.execute(
            """
            SELECT
              COUNT(*) AS activities,
              ROUND(SUM(distance_km), 2) AS distance_km,
              COUNT((SELECT 1 FROM track_points WHERE track_points.activity_id = activities.id)) AS activities_with_tracks
            FROM activities
            """
        ).fetchone()
    print(f"Built {DB_PATH}")
    print(f"Imported {totals[0]} activities, {totals[1]} km")


if __name__ == "__main__":
    main()
