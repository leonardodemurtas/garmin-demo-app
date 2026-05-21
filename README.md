# Garmin Web Data Demo

This is a self-contained demo app built from real Garmin Connect activity data captured from the web.

## Run

```bash
python3 scripts/import_garmin.py
python3 server.py
```

Then open http://localhost:8000/runs.

Use a different port with:

```bash
PORT=8001 python3 server.py
```

## Data Flow

- `source-data/` contains the captured Garmin activity bundles.
- `scripts/import_garmin.py` builds `data/garmin_demo.sqlite`.
- `server.py` serves the SQLite-backed API and static app.
- `static/` contains the desktop browser UI and the vendored ECharts bundle.

The database includes activity summaries, stats, laps, segments, heart-rate zones, GPS track points, and Garmin export files as blobs.
