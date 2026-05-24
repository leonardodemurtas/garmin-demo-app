import json
import mimetypes
import sqlite3
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "garmin_demo.sqlite"
STATIC_DIR = ROOT / "static"


def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _rows(rows):
    return [dict(r) for r in rows]


def _clock(seconds):
    if seconds is None:
        return None
    seconds = int(round(seconds))
    h, r = divmod(seconds, 3600)
    m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def _summary():
    with _connect() as conn:
        row = dict(conn.execute("""
            SELECT COUNT(*) AS activity_count,
              ROUND(SUM(distance_km), 2) AS total_distance_km,
              SUM(duration_seconds) AS total_duration_seconds,
              ROUND(SUM(total_ascent_m), 0) AS total_ascent_m,
              ROUND(AVG(avg_hr_bpm), 0) AS avg_hr_bpm,
              MIN(activity_date) AS first_date,
              MAX(activity_date) AS last_date
            FROM activities
        """).fetchone())
        row["total_duration"] = _clock(row["total_duration_seconds"])
        row["track_point_count"] = conn.execute("SELECT COUNT(*) FROM track_points").fetchone()[0]
        row["export_count"] = conn.execute("SELECT COUNT(*) FROM exports").fetchone()[0]
        row["activities"] = _activities(conn)
        return row


def _provenance():
    with _connect() as conn:
        row = dict(conn.execute("""
            SELECT COUNT(*) AS activity_count,
              MIN(activity_date) AS first_date,
              MAX(activity_date) AS last_date,
              MAX(captured_at) AS latest_capture
            FROM activities
        """).fetchone())
        row["database"] = "data/garmin_demo.sqlite"
        row["track_point_count"] = conn.execute("SELECT COUNT(*) FROM track_points").fetchone()[0]
        row["export_count"] = conn.execute("SELECT COUNT(*) FROM exports").fetchone()[0]
        row["source_bundle_count"] = len(list((ROOT / "source-data").glob("*.zip")))
        return row


def _activities(conn=None):
    close = conn is None
    conn = conn or _connect()
    try:
        return _rows(conn.execute("""
            SELECT id, activity_date, name, type, url, distance_km,
              duration_seconds, avg_pace_seconds_per_km, total_ascent_m,
              calories, avg_hr_bpm, max_hr_bpm, device_name
            FROM activities ORDER BY activity_date DESC
        """).fetchall())
    finally:
        if close:
            conn.close()


def _activity_detail(activity_id):
    with _connect() as conn:
        activity = conn.execute("SELECT * FROM activities WHERE id = ?", (activity_id,)).fetchone()
        if not activity:
            return None
        track = _rows(conn.execute(
            "SELECT sequence, lat, lon, elevation_m, point_time, hr_bpm, cadence_spm "
            "FROM track_points WHERE activity_id = ? ORDER BY sequence",
            (activity_id,),
        ).fetchall())
        return {
            "activity": dict(activity),
            "laps": _rows(conn.execute(
                "SELECT * FROM laps WHERE activity_id = ? ORDER BY lap_number", (activity_id,)
            ).fetchall()),
            "segments": _rows(conn.execute(
                "SELECT * FROM segments WHERE activity_id = ? ORDER BY id", (activity_id,)
            ).fetchall()),
            "zones": _rows(conn.execute(
                "SELECT * FROM heart_rate_zones WHERE activity_id = ? ORDER BY zone_number DESC", (activity_id,)
            ).fetchall()),
            "track": track,
            "exports": _rows(conn.execute(
                "SELECT id, kind, filename, mime_type, byte_size FROM exports WHERE activity_id = ? ORDER BY kind",
                (activity_id,),
            ).fetchall()),
        }


def _serve_static(path):
    if path in ("", "/"):
        target = STATIC_DIR / "index.html"
    else:
        target = (STATIC_DIR / path.lstrip("/")).resolve()
        if STATIC_DIR.resolve() not in target.parents and target != STATIC_DIR.resolve():
            return 403, None, None
    if not target.exists() or not target.is_file():
        return 404, None, None
    data = target.read_bytes()
    ct = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
    return 200, ct, data


def app(environ, start_response):
    path = unquote(environ.get("PATH_INFO", "/"))

    def send_json(data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        start_response("200 OK", [
            ("Content-Type", "application/json; charset=utf-8"),
            ("Content-Length", str(len(body))),
        ])
        return [body]

    def send_error(code, msg):
        body = msg.encode()
        start_response(f"{code} {msg}", [
            ("Content-Type", "text/plain"),
            ("Content-Length", str(len(body))),
        ])
        return [body]

    if path == "/api/summary":
        return send_json(_summary())
    if path == "/api/provenance":
        return send_json(_provenance())
    if path == "/api/activities":
        return send_json(_activities())

    if path.startswith("/api/activities/"):
        parts = [p for p in path.split("/") if p]
        if len(parts) == 3:
            detail = _activity_detail(parts[2])
            return send_json(detail) if detail else send_error(404, "Activity not found")
        if len(parts) == 5 and parts[3] == "exports":
            with _connect() as conn:
                row = conn.execute(
                    "SELECT filename, mime_type, payload FROM exports WHERE activity_id = ? AND id = ?",
                    (parts[2], parts[4]),
                ).fetchone()
            if not row:
                return send_error(404, "Export not found")
            payload = bytes(row["payload"])
            start_response("200 OK", [
                ("Content-Type", row["mime_type"]),
                ("Content-Length", str(len(payload))),
                ("Content-Disposition", f'attachment; filename="{row["filename"]}"'),
            ])
            return [payload]

    if path == "/runs" or path.startswith("/runs/"):
        path = "/"

    status, ct, data = _serve_static(path)
    if status == 403:
        return send_error(403, "Forbidden")
    if status == 404:
        return send_error(404, "Not Found")
    start_response("200 OK", [("Content-Type", ct), ("Content-Length", str(len(data)))])
    return [data]
