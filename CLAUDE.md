# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`demo/` is a self-contained Garmin Connect demo web app used by the parent repo (`/Users/leo/dev/cli`) as a target for testing browser-sniff / end-to-end flows of the Printing Press generator. It is **not** production code and is modified rarely — see the parent `CLAUDE.md` ("demo/ directory") before making structural changes.

## Run

```bash
python3 scripts/import_garmin.py    # (re)build data/garmin_demo.sqlite from source-data/*.zip
python3 server.py                   # serves on http://127.0.0.1:8000 (override with PORT=...)
```

`server.py` refuses to start if `data/garmin_demo.sqlite` is missing; rerun the importer.

There is no test suite, lint config, or package manager — pure stdlib Python 3 plus a vendored ECharts bundle in `static/vendor/`.

## Architecture

One process, three layers, all stdlib:

- **Importer (`scripts/import_garmin.py`)** — parses Garmin activity export zips in `source-data/` (CSV summary + GPX/TCX/FIT tracks) and writes a fresh SQLite DB at `data/garmin_demo.sqlite`. Schema is defined inline at the top of the script and drops/recreates every table on each run. Tables: `activities`, `laps`, `segments`, `heart_rate_zones`, `track_points`, `exports` (raw files stored as BLOBs).
- **Server (`server.py`)** — single-file `ThreadingHTTPServer` with a hand-rolled `DemoHandler.do_GET` router. Routes:
  - `/api/summary`, `/api/provenance`, `/api/activities`, `/api/activities/{id}`, `/api/activities/{id}/exports/{export_id}` → JSON / file blob from SQLite.
  - `/runs` and `/runs/*` → serve the SPA shell (`static/index.html`).
  - Everything else → static file under `static/` (path-traversal guarded via `resolve()` + parent check).
- **Frontend (`static/`)** — vanilla JS SPA (`app.js`, `index.html`, `styles.css`) that hits the JSON API and renders charts with the vendored ECharts. `static/register-a/` is an unrelated scratch/archetype area (has its own README) — don't conflate it with the main UI.

Data flow: `source-data/*.zip` → importer → `data/garmin_demo.sqlite` → server → SPA. Re-running the importer is the only way to refresh the DB; the server never writes.

## Conventions

- Stdlib only on the Python side. Don't introduce Flask/FastAPI/SQLAlchemy — the point is a dependency-free reference target.
- Don't commit changes to `data/garmin_demo.sqlite` casually; it's a regenerable artifact.
- `source-data/` holds real captured Garmin bundles; treat as fixtures and don't reshape filenames (the importer parses dates/IDs from them).
