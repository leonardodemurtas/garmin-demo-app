# Reference notes

Calibration log: which Linear reference shots in the vault each archetype was tuned against, and which Register A principles were emphasized.

Vault path: `<vault-root>/03_Content-Pipeline/drafts/brand-look-and-feel/references/linear-selected/`

## A.1 — Product Picker / Selected Row (`archetypes/a1-picker.html`)

Calibrated against the Linear command/picker shots in `linear-selected/`. Open one of the picker references side-by-side at the same display size before scoring.

Principles emphasized:

- One centered panel, ~62% of frame width, vertical band 28%–62% (`DESIGN.md` → "Calibrated proportions for Register A").
- Selected row is in `--pe-panel-selected` with strong text; surrounding rows step down through `--pe-dim-1` and `--pe-dim-2`.
- Single accent: a thin orange cursor in the header — the only orange in the frame.
- Trailing check icon on the selected row, not a button or pill.
- Caption headline + one body line; bottom-left, aligned to figure label inset.

Common drift to watch:

- If every row reads at equal opacity, focus is lost — push outer rows to `--pe-dim-2`.
- If the selected row uses bright accent fill, it starts looking like a button. Keep it `--pe-panel-selected` (charcoal).

## A.2 — Floating Issue Table / Chip Field (`archetypes/a2-chip-field.html`)

Calibrated against the Linear issue-list shots in `linear-selected/` — the views that show issue IDs, status pills, avatars, and dates without a heavy outer table container.

Principles emphasized:

- No outer panel — rows float on `--pe-canvas` (`DESIGN.md` → A.2 "no heavy outer table container").
- 2 rows in focus at full opacity; 2 at `--pe-dim-1`; 2 at `--pe-dim-2`.
- `.pe-fade-mask--vignette` over the whole stack softens edges in all directions.
- Status colors used as encoded state only — not as broad palette.
- Tabular-aligned columns: ID chip, title, status chip, avatar, date.

Common drift to watch:

- If the rows feel like a "full dashboard table," remove background fills and dividers; the absence of an outer container is the point.
- If outer rows are too visible, push them further to `--pe-dim-2`. The fade should feel intentional.

## A.5 — Command Composer (`archetypes/a5-composer.html`)

Calibrated against the Linear composer/AI prompt shots in `linear-selected/` — large rounded composer with toolbar and a single accent send control.

Principles emphasized:

- Large rounded panel using `--pe-radius-composer` (20px).
- Prominent body text with one inline `.pe-mention` chip in `--pe-accent`.
- Toolbar icons sit muted at `--pe-text-metadata`; only the send button carries the accent.
- Optional dim layer behind the composer at `--pe-dim-3` to suggest the surface the composer sits over.
- Caption names what the composer is about to do, not what the UI is.

Common drift to watch:

- More than two orange elements means the active-path discipline has slipped. Demote either the mention or the cursor; the send button is the load-bearing accent.
- A giant send button reads as marketing CTA. Keep it ~40px, square-cornered, just enough to be readable.

## Open questions

- Do the type sizes calibrated for 1200px need a media-query rescale when these are embedded in a wider page? Probably yes for thumbnails (the specimen page handles it via `transform: scale`).
- A.2's vignette mask may be too aggressive at small canvas sizes. Revisit if archetypes are ever rendered below 800px.
