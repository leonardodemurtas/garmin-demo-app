#!/usr/bin/env python3
import json
import mimetypes
import os
import sqlite3
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "garmin_demo.sqlite"
STATIC_DIR = ROOT / "static"


def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def rows_to_dicts(rows):
    return [dict(row) for row in rows]


def seconds_to_clock(seconds):
    if seconds is None:
        return None
    seconds = int(round(seconds))
    hours, rem = divmod(seconds, 3600)
    minutes, secs = divmod(rem, 60)
    if hours:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"


class DemoHandler(BaseHTTPRequestHandler):
    server_version = "GarminDemo/1.0"

    def do_GET(self):
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        if path == "/api/summary":
            self.write_json(self.summary())
            return
        if path == "/api/provenance":
            self.write_json(self.provenance())
            return
        if path == "/api/activities":
            self.write_json(self.activities())
            return
        if path.startswith("/api/activities/"):
            parts = [part for part in path.split("/") if part]
            if len(parts) == 3:
                self.write_json(self.activity_detail(parts[2]))
                return
            if len(parts) == 5 and parts[3] == "exports":
                self.write_export(parts[2], parts[4])
                return
        if path == "/runs" or path.startswith("/runs/"):
            self.write_app_shell()
            return
        self.write_static(path)

    def summary(self):
        with connect() as conn:
            summary = dict(
                conn.execute(
                    """
                    SELECT
                      COUNT(*) AS activity_count,
                      ROUND(SUM(distance_km), 2) AS total_distance_km,
                      SUM(duration_seconds) AS total_duration_seconds,
                      ROUND(SUM(total_ascent_m), 0) AS total_ascent_m,
                      ROUND(AVG(avg_hr_bpm), 0) AS avg_hr_bpm,
                      MIN(activity_date) AS first_date,
                      MAX(activity_date) AS last_date
                    FROM activities
                    """
                ).fetchone()
            )
            summary["total_duration"] = seconds_to_clock(summary["total_duration_seconds"])
            summary["track_point_count"] = conn.execute("SELECT COUNT(*) FROM track_points").fetchone()[0]
            summary["export_count"] = conn.execute("SELECT COUNT(*) FROM exports").fetchone()[0]
            summary["activities"] = self.activities(conn)
            return summary

    def provenance(self):
        with connect() as conn:
            row = conn.execute(
                """
                SELECT
                  COUNT(*) AS activity_count,
                  MIN(activity_date) AS first_date,
                  MAX(activity_date) AS last_date,
                  MAX(captured_at) AS latest_capture
                FROM activities
                """
            ).fetchone()
            payload = dict(row)
            payload["database"] = str(DB_PATH.relative_to(ROOT))
            payload["track_point_count"] = conn.execute("SELECT COUNT(*) FROM track_points").fetchone()[0]
            payload["export_count"] = conn.execute("SELECT COUNT(*) FROM exports").fetchone()[0]
            payload["source_bundle_count"] = len(list((ROOT / "source-data").glob("*.zip")))
            return payload

    def activities(self, conn=None):
        close_conn = conn is None
        conn = conn or connect()
        try:
            return rows_to_dicts(
                conn.execute(
                    """
                    SELECT
                      id, activity_date, name, type, url, distance_km,
                      duration_seconds, avg_pace_seconds_per_km, total_ascent_m,
                      calories, avg_hr_bpm, max_hr_bpm, device_name
                    FROM activities
                    ORDER BY activity_date DESC
                    """
                ).fetchall()
            )
        finally:
            if close_conn:
                conn.close()

    def activity_detail(self, activity_id):
        with connect() as conn:
            activity = conn.execute("SELECT * FROM activities WHERE id = ?", (activity_id,)).fetchone()
            if not activity:
                self.send_error(404, "Activity not found")
                return None
            track = rows_to_dicts(
                conn.execute(
                    "SELECT sequence, lat, lon, elevation_m, point_time, hr_bpm, cadence_spm FROM track_points WHERE activity_id = ? ORDER BY sequence",
                    (activity_id,),
                ).fetchall()
            )
            return {
                "activity": dict(activity),
                "laps": rows_to_dicts(conn.execute("SELECT * FROM laps WHERE activity_id = ? ORDER BY lap_number", (activity_id,)).fetchall()),
                "segments": rows_to_dicts(conn.execute("SELECT * FROM segments WHERE activity_id = ? ORDER BY id", (activity_id,)).fetchall()),
                "zones": rows_to_dicts(conn.execute("SELECT * FROM heart_rate_zones WHERE activity_id = ? ORDER BY zone_number DESC", (activity_id,)).fetchall()),
                "track": track,
                "exports": rows_to_dicts(
                    conn.execute(
                        "SELECT id, kind, filename, mime_type, byte_size FROM exports WHERE activity_id = ? ORDER BY kind",
                        (activity_id,),
                    ).fetchall()
                ),
            }

    def write_export(self, activity_id, export_id):
        with connect() as conn:
            row = conn.execute(
                "SELECT filename, mime_type, payload FROM exports WHERE activity_id = ? AND id = ?",
                (activity_id, export_id),
            ).fetchone()
            if not row:
                self.send_error(404, "Export not found")
                return
            payload = row["payload"]
            self.send_response(200)
            self.send_header("Content-Type", row["mime_type"])
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Content-Disposition", f'attachment; filename="{row["filename"]}"')
            self.end_headers()
            self.wfile.write(payload)

    def write_app_shell(self):
        self.write_static("/")

    def write_json(self, payload):
        if payload is None:
            return
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def write_static(self, path):
        if path in ("", "/"):
            target = STATIC_DIR / "index.html"
        else:
            target = (STATIC_DIR / path.lstrip("/")).resolve()
            if STATIC_DIR.resolve() not in target.parents and target != STATIC_DIR.resolve():
                self.send_error(403)
                return
        if not target.exists() or not target.is_file():
            self.send_error(404)
            return
        data = target.read_bytes()
        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    if not DB_PATH.exists():
        raise SystemExit("Database not found. Run: python3 scripts/import_garmin.py")
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("127.0.0.1", port), DemoHandler)
    print(f"Garmin demo running at http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
