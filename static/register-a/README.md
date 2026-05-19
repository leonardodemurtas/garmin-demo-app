# register-a-dev

Dev styles for **Register A — Product-Evidence**, the default visual register defined in `DESIGN.md` of the LLM Wiki vault. Plain HTML, Tailwind via CDN, Lucide via CDN. No build step.

The spec lives in the vault at `DESIGN.md`. This project is the executable counterpart: tokens, primitives, and three archetype figures that you can open directly in a browser and compare against the Linear reference set.

## Run

Open any file in a browser. Tailwind CDN, Lucide CDN, and Google Fonts all work over `file://`.

```bash
open index.html               # specimen
open archetypes/a1-picker.html
open archetypes/a2-chip-field.html
open archetypes/a5-composer.html
```

For the archetypes, render at native size (no zoom-to-fit) — they are calibrated to a 1200x1200 canvas.

## Layout

```
register-a-dev/
├── README.md
├── index.html                   specimen: tokens, type scale, primitives, archetypes, rubric
├── tailwind.config.js           Tailwind theme extension that mirrors tokens.css
├── styles/
│   ├── tokens.css               source of truth — every value traceable to DESIGN.md
│   └── components.css           framework-agnostic primitives (.pe-frame, .pe-panel, .pe-row, ...)
├── archetypes/
│   ├── a1-picker.html           FIG. 1.1 — Product Picker / Selected Row
│   ├── a2-chip-field.html       FIG. 1.2 — Floating Issue Table / Chip Field
│   └── a5-composer.html         FIG. 1.5 — Command Composer
└── reference-notes.md           which Linear references each archetype is calibrated against
```

## Stack

| Layer | Where it comes from |
| --- | --- |
| Tokens | `styles/tokens.css` — CSS custom properties on `:root`, namespaced `--pe-*` |
| Tailwind utilities | `tailwind.config.js` extends the Play CDN theme with the same tokens |
| Component classes | `styles/components.css` — plain CSS, works without Tailwind |
| Icons | Lucide via `https://unpkg.com/lucide@latest`, `<i data-lucide="check">` |
| Fonts | Inter + JetBrains Mono via Google Fonts CDN |

## Page boilerplate

Every archetype shares this `<head>` block. Copy when adding a new archetype.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../styles/tokens.css" />
<link rel="stylesheet" href="../styles/components.css" />

<script src="https://cdn.tailwindcss.com"></script>
<script src="../tailwind.config.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>

<style>html, body { margin: 0; padding: 0; background: var(--pe-canvas); }</style>
```

Each archetype ends with:

```html
<script>lucide.createIcons();</script>
```

## Guardrails

Encoded in `components.css`:

- **No hex codes outside `tokens.css`.** Components and archetypes read tokens, never raw colors.
- **Orange is bounded** to `.pe-cursor`, `.pe-send`, `.pe-mention`, and `.pe-chip--mention`. The "accent < 3% of frame" rule is enforced structurally, not by discipline alone.
- **Fade is a primitive,** not an afterthought — `.pe-fade-mask--top/bottom/edges/vignette` masks panel edges toward the canvas color so figures dissolve into the dark field.
- **1200x1200 calibration.** All type sizes and spacing are tuned for a 1200px canvas so screenshots diff cleanly against the Linear reference set in the vault.

## Verification

1. Open `index.html`. Confirm token swatches, type scale, primitives, and archetype thumbs render with no console errors.
2. Open each archetype standalone at native size. Compare side-by-side with the matching reference in the vault's `03_Content-Pipeline/drafts/brand-look-and-feel/references/linear-selected/`.
3. Score each archetype against the Register A pass/fail rubric (also rendered at the bottom of `index.html`).
4. Token discipline grep:
   ```bash
   grep -REn '#[0-9A-Fa-f]{3,8}' . --include='*.html' --include='*.css' --include='*.js' \
     --exclude=styles/tokens.css --exclude=tailwind.config.js
   ```
   Expected: only the swatch values inside `index.html` (where hex strings are content, not styling).
5. Accent budget per archetype:
   - `a1-picker.html` — 1 occurrence (cursor in header)
   - `a2-chip-field.html` — 0 occurrences (no orange chips needed)
   - `a5-composer.html` — 2 occurrences (mention chip + send button)

## v0 scope

In: tokens, primitives, A.1 / A.2 / A.5 archetypes, specimen page.

Out: archetypes A.3, A.4, A.6, A.7, A.8; build pipeline; React/Vue wrappers; screenshot export; Registers B and C.

## Linking back

This project lives outside the second-brain vault but the spec it implements is at `<vault-root>/DESIGN.md`, sections:

- Baseline Palette
- Typography
- Canonical Figure Frame
- Cross-Cutting Principles
- Part A — Product-Evidence Register (archetypes A.1, A.2, A.5; failure modes; pass/fail rubric)
