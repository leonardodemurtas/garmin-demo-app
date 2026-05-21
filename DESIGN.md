---
version: beta
name: Product-Evidence, Role/Flow, and Gradient Glass Visual Direction
description: Art-direction guide for LLM Wiki visuals, covering three registers: Product-Evidence (single captured product state), Role/Flow Diagram (labeled panels and connectors for relationships and flow), and Gradient Glass Signal (wide translucent concept/header visuals on the fixed brand background).
source-assessment: 03_Content-Pipeline/drafts/brand-look-and-feel/look-and-feel-assessments.md
reference-folder: 03_Content-Pipeline/_visuals/references/
register-a-references: 03_Content-Pipeline/_visuals/references/linear-selected/
register-b-references: 03_Content-Pipeline/_visuals/references/ (apple, c4, cloudflare, excalidraw, linear, mcp, mermaid, notion, plantuml, stripe subfolders)
register-c-references: 03_Content-Pipeline/_visuals/references/glassmorphism/
register-c-analysis: 03_Content-Pipeline/_visuals/glass-visual-analysis.md
register-c-background: 03_Content-Pipeline/_visuals/brand/brand-background.png
related-curation: 03_Content-Pipeline/drafts/garmin-connect-schema-visual-references.md
last-updated: 2026-05-20
---

# Product-Evidence, Role/Flow, and Gradient Glass Visual Direction

This file is the canonical visual direction for generated images, diagrams, screenshots, social cards, thumbnails, slide visuals, mockups, UI panels, visual-reference sheets, and prompts intended for another visual tool.

It is an art-direction spec first. The goal is not to satisfy a token checklist. The goal is to make each visual feel intentionally staged: precise, concrete, product-native, and editorially useful.

This spec defines three registers. **Register A - Product-Evidence** captures one concrete product state. **Register B - Role / Flow Diagram** names the spatial relationship between several roles, surfaces, or steps with labels and connectors. **Register C - Gradient Glass Signal** is a wide-format variant for concept/header visuals: translucent product fragments, signal lines, glass pills, and the fixed dark brand background.

The reference set lives in `03_Content-Pipeline/_visuals/references/`. Register A references are in `linear-selected/`. Register B references are in the other subfolders (`apple/`, `c4/`, `cloudflare/`, `excalidraw/`, `linear/`, `mcp/`, `mermaid/`, `notion/`, `plantuml/`, `stripe/`). Register C references are in `glassmorphism/`, with per-image analysis in `03_Content-Pipeline/_visuals/glass-visual-analysis.md`. The deeper audit trail lives in `03_Content-Pipeline/drafts/brand-look-and-feel/look-and-feel-assessments.md`. Curated Register B style families (C4, MCP, Stripe, Notion, Apple, Cloudflare, Excalidraw, Mermaid/PlantUML, Linear, Increment) are documented in `03_Content-Pipeline/drafts/garmin-connect-schema-visual-references.md`.

## North Star

A Register A image should feel like a polished product-marketing fragment from serious software. It should not feel like a generic AI illustration, a dashboard mockup made from default cards, or a diagram decorated with UI parts.

Aim for:

- near-black space
- one clear product state
- realistic software density
- restrained color
- soft falloff into darkness
- compact but legible UI details
- a bottom-left caption that feels intentional
- a tiny figure label that feels like documentation, not branding

The emotional target is controlled momentum. The reader should feel: "this is a real operating surface where something specific is happening."

A Register B image should feel like a documentation figure from serious infrastructure docs — same dark stage, same restraint, but spatial relationships made explicit. Labels above panels, thin connector lines, one orange line carrying the active path. The reader should feel: "this is the wiring of a system, and one route through it is the point."

A Register C image should feel like contemporary product-blog art for an AI developer platform translated into this wiki's dark brand system: technical, soft, and product-native without becoming decorative. The subject is usually a signal, command, workflow state, product fragment, or capability field suspended on `03_Content-Pipeline/_visuals/brand/brand-background.png`. The reader should feel: "a system is processing intent into action."

All registers reject stock-feeling AI decoration, robot heads, brains, sparkles, logo walls, and copied product compositions. Register C is the only allowed place for glassmorphism. Its glass comes from neutral translucent objects over the fixed brand background, not from colorful aurora backdrops. It must still contain product or system evidence, not just pretty translucent cards.

## Visual Registers

Pick a register before composing. The choice is determined by what the essay is arguing.

|                           | Register A — Product-Evidence                                                  | Register B — Role / Flow Diagram                                                                                     | Register C — Gradient Glass Signal                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **The argument is about** | A captured product moment                                                      | A relationship across moments                                                                                        | A high-level product, agent, model, or workflow concept                                               |
| **Use when**              | One row is selected, a menu is open, a command is ready, a status has breached | Roles hand work to each other, control moves between human and agent, a request becomes a record, a system has zones | A blog header, thumbnail, opener, or concept visual needs a soft technical mood on the brand background |
| **Subject**               | A single product fragment, mostly real                                         | Several labeled panels or steps, each containing real product fragments                                              | Abstracted product evidence: waveform, command pill, file panel, code window, orbit, capability field |
| **Connectors**            | None — relationships are implicit through composition                          | Thin neutral lines and one orange active path                                                                        | White hairline routes, waveforms, dashed paths, orbit rings, or dotted grids                          |
| **Panel labels**          | None — UI labels live inside the product fragment                              | Small muted role labels above panels (`Human`, `Agent`, `Product`, etc.)                                             | One to three short labels inside glass pills or panels; avoid explanatory text                        |
| **Placeholder content**   | Avoided — every detail is real                                                 | Encouraged — gray bars abstract content so structure leads                                                           | Allowed as symbolic product texture: code lines, file names, status words, waveform/time marks        |
| **Reference subfolder**   | `linear-selected/`                                                             | `c4/`, `mcp/`, `stripe/`, `notion/`, `apple/`, `cloudflare/`, `linear/`, `excalidraw/`, `mermaid/`, `plantuml/`      | `glassmorphism/` plus fixed background `brand/brand-background.png`                                   |
| **Default aspect**        | Square (1:1)                                                                   | Square or landscape (4:3 / 16:10) for two-or-three panel layouts                                                     | Wide banner, usually around 1600x590 or 1600x602                                                      |
| **Caution**               | Do not drift into diagrammatic feel by accident                                | Do not strip product fragments down to Visio boxes                                                                   | Do not turn the system into pretty glass wallpaper                                                    |

If you cannot show the idea inside one product state, you need Register B. If the piece needs a wide header or atmospheric opener rather than a numbered claim figure, consider Register C. If you can show the idea as concrete product evidence, Register A remains the default.

## Reference Fidelity vs. Brand Adaptation

There are two layers in this system.

**Reference fidelity** is what must survive from the reference images.

For Registers A and B:

- dark product-native staging
- centered or upper-middle subject placement (Register A) or labeled panels on the dark stage (Register B)
- large negative space
- dense product fragments, not abstract metaphors
- subtle borders, opacity, and fade instead of heavy shadows
- small functional color accents
- caption and figure-label structure
- UI that feels captured from a mature product

For Register C:

- wide dark brand-background field
- one dominant product/system signal
- symbolic product evidence linked to that signal
- white-line technical geometry
- translucent glass only as support, not as the subject by itself
- existing brand grain and diagonal texture from `brand-background.png`
- minimal primary labels with optional tiny UI microcopy
- no copied launch composition
- no colorful aurora, rainbow wash, decorative blob, or new background palette

**Brand adaptation** is where this wiki may intentionally diverge:

- Use the wiki accent `#FF7133` instead of the reference indigo when a main accent is needed.
- Do not copy Linear logos, exact product layouts, proprietary UI content, or recognizable page compositions.
- Use fictional but plausible product states (Register A) or fictional but plausible role labels (Register B) that support the essay argument.
- For Register C, use the reference set for visual grammar only: waveform, command pill, file panel, orbit field, route burst, state chain, glass border, and white technical linework. Do not copy the colorful reference backgrounds. Use `03_Content-Pipeline/_visuals/brand/brand-background.png` as the background plate. Do not prompt for `OpenAI-style`, `ChatGPT-style`, or any named brand style. Do not copy OpenAI brand marks, exact blog-header compositions, or exact launch labels from the references. Rewrite the concept around this wiki's argument and change the geometry, labels, icon set, and focal placement.

If matching the reference is more important than branding for a specific experiment, use indigo only inside the experiment folder and label it as a reference-fidelity study. For public wiki visuals, orange is the canonical accent.

## Shared Foundations

Everything in this section applies to Registers A and B, and to Register C except where Part C explicitly overrides it.

### Baseline Palette

Use these values as anchors, not as a complete token API.

- Canvas: `#08090A`
- Deep panel: `#0F1011`
- Raised panel: `#141516`
- Selected panel: `#1C1C1F`
- Raised chip: `#232326`
- Subtle border: `rgba(255,255,255,0.07)`
- Strong border: `rgba(255,255,255,0.11)`
- Primary text: `#F7F8F8`
- Secondary text: `#D0D6E0`
- Metadata text: `#8A8F98`
- Dim text: `#62666D`
- Figure label: `#3A3D44`
- Accent: `#FF7133`
- Accent muted: `#CE5C2B`, `#9C4723`, `#6B331A`, `#391E12`
- Status colors: green `#5BC47A`, yellow `#F2C94C`, red `#EB5757`, teal `#4EC3C7`, muted orange `#F2994A`
- Connector neutral (Register B): `rgba(255,255,255,0.11)`
- Connector active (Register B): `#FF7133`

The frame should be at least 90 percent neutral by feeling. Accent color should read as a signal, not a theme.

For Register C, the background is not an open color choice. Use `03_Content-Pipeline/_visuals/brand/brand-background.png` as the visual material. Foreground UI states remain white or neutral unless a tiny functional state mark is required. `#FF7133` remains the only public action accent when an explicit action accent is needed.

### Typography

Use Inter, SF Pro, or a similarly neutral product sans. Use monospace only when it carries machine/documentation meaning.

For a square canvas around 1100-1300 px:

- Figure label: 18-22 px monospace, wide tracking, very low contrast.
- Caption headline: 24-30 px sans, semibold, white.
- Caption body: 24-30 px sans, regular, muted gray, generous line-height.
- Product UI labels: 20-32 px depending on subject scale.
- Tiny metadata inside UI: 14-22 px.
- Annotation labels such as `BREACHED`: 18-22 px monospace, uppercase, muted.
- Register B panel labels (role / stage / zone names): 20-26 px sans, regular weight, metadata text color `#8A8F98`, positioned 16-24 px above the panel. Quiet and structural — never a headline.

For exported images smaller than 1000 px wide, scale these proportionally. Do not shrink captions to the point where they feel like legal copy. In the references, the caption is part of the composition.

Use monospace only for:

- `FIG. X.Y`
- commit hashes and code-like IDs
- inline code tokens such as `vehicle_state`
- uppercase annotation labels such as `BREACHED`

Use sans for issue numbers, menu labels, row names, dates, people, ordinary product UI, and Register B panel labels.

### Canonical Figure Frame

Most visuals in `03_Content-Pipeline/` use this frame.

- Canvas: square or near-square for Register A, usually 1100-1300 px. Register B may use landscape or 4:3 when two or three labeled panels need to sit side by side.
- Background: flat near-black `#08090A`.
- Figure label: top-left, 35-55 px from both edges. Same position regardless of register or aspect ratio.
- Main subject: centered horizontally for Register A, usually upper-middle. Register B panels distribute across the upper two thirds of the frame as the archetype requires.
- Caption: bottom-left, aligned to the figure label. Same position regardless of register or aspect ratio.
- Caption block: headline plus one or two body lines.
- Quiet gap: leave a deliberate gap between subject and caption.

Calibrated proportions for Register A:

- Main subject width: 60-75 percent of the frame for product UI.
- Main subject width: 50-65 percent only for sparse abstract motifs.
- Main subject vertical band: often begins around 25-32 percent of canvas height and ends around 58-68 percent.
- Caption band: lower 15-22 percent of the frame.
- Bare dark space: at least 35 percent, often closer to 50 percent.

Calibrated proportions for Register B:

- Combined panel area: 65-80 percent of the frame width when two or three panels share a row.
- Panel vertical band: often begins around 18-25 percent of canvas height and ends around 60-70 percent (panels can be larger than a single Register A subject because each one carries less detail).
- Caption band: lower 15-22 percent of the frame (same as Register A).
- Bare dark space: at least 30 percent, often more around panel edges to support the fade.

Calibrated proportions for Register C:

- Canvas: wide banner around 1600x590 or 1600x602, or the nearest equivalent wide crop.
- Main subject width: 35-60 percent of the frame, usually centered or slightly off-center.
- Main subject vertical band: usually sits around the middle third of the canvas, with enough top/bottom air for the brand background and signal lines.
- Caption and figure label: optional. Blog-header and thumbnail uses may omit both. If used as a numbered figure, preserve the top-left figure label and bottom-left caption from the canonical frame.
- Bare brand-background field: at least 40 percent of the image. The field is the material, not filler.

### Cross-Cutting Principles

These apply to Registers A and B, and to Register C when Part C does not explicitly override them.

#### Fade Is Part Of The Style

Use opacity, masks, and low-contrast edges to let product fragments dissolve into the canvas.

Common moves:

- dim inactive rows to 15-45 percent opacity (Register A)
- dim non-focal panels to 50-60 percent brightness (Register B)
- fade top, bottom, or side rows into black
- place a dim product surface behind a foreground popover
- suppress background content while preserving its silhouette
- use a soft edge vignette, not a decorative gradient

The visual should not look like a flat SVG component sitting on a black rectangle.

#### Depth Is Shallow

Use borders, tonal shifts, top-edge highlights, and suppressed background layers. Heavy shadows make the image feel like a mockup kit.

Floating product surfaces (Register A subjects and Register B panels alike):

- fill: `#0F1011` to `#191A1B`
- border: 1 px `rgba(255,255,255,0.07)`
- radius: 12-20 px depending on scale
- top-edge highlight: subtle 1 px white at 4-7 percent opacity
- shadow: soft, black, felt more than seen

Use bigger radii only when copying the scale of a reference-like menu, composer, or stage. Avoid bubbly cards.

#### Color Is Functional

Orange `#FF7133` is the public-system accent. Use it like a scalpel:

- insertion cursor (Register A)
- send button (Register A)
- selected leading bar (Register A)
- mention chip (Register A)
- the one active connector (Register B)
- thin connector endcap dot (Register B)
- one small action or focus mark

Keep accent coverage below 3 percent of the image. Never use orange as a broad wash. In Register B, only one orange connector per figure — additional flows demote to neutral `rgba(255,255,255,0.11)`.

Status colors are allowed only when they encode state. Keep them tiny: dots, small glyphs, small square indicators, or compact icon fills. They should never become the palette.

#### Caption Is Composition

The caption is not metadata glued onto the bottom. It is part of the figure's editorial rhythm.

Use:

- short white headline
- one or two muted body lines
- left alignment
- generous line-height
- no decorative rules, badges, or framing

On a 1250 px canvas, a 17 px headline is too small. Start around 26 px and adjust only if the final export demands it. The caption applies the same way in Registers A and B. Register C may omit the caption for blog-header and thumbnail uses.

### Brand-Mark Policy

Real brand marks can appear only when the visual is about a tool's role in a workflow.

Allowed:

- inline next to a tool name in a picker or menu (Register A)
- in an integration grid as subdued monochrome marks (Register A)
- as small metadata inside a product-like fragment (any register, only when the named tool is essential)
- next to a panel role label only when the role IS a specific tool the essay names (Register B), and even then prefer generic names

Not allowed:

- as the hero of a figure
- as decoration
- as a copied product layout
- in a logo wall that becomes the visual identity
- as the primary content of a Register B panel (a panel labeled `Linear` whose only content is the Linear logo is a brand wall, not a Role/Flow Diagram)

When in doubt, use fictional names and generic marks.

For Register C, use generic tool icons by default. Real brand marks are disallowed unless the brief is explicitly about that tool, and even then they must be tiny metadata inside a product fragment, never part of the hero signal.

## Part A — Product-Evidence Register

The default register. Use it whenever the essay can land inside one product moment.

### When to Use Register A

- A row is selected and the choice is the point
- A menu is opened and the path is the point
- A command is ready to send and the readiness is the point
- A status has breached and the alert is the point
- An issue is being created from a thread and the surface is the point
- A schedule popover is over a triage screen and the assignment is the point
- An agent action is waiting for permission and the consent is the point
- A trace reveals where governance is missing and the gap is the point

If the moment itself carries the meaning, this is the register.

### Principle: Product Evidence First

Every Register A visual shows one concrete product state. Prefer product situations over metaphors. Avoid robots, brains, sparkles, magic beams, giant hands, generic network nodes, and decorative AI symbolism.

The drift to avoid: a tidy 50-55 percent panel in the exact center with tiny caption text. That reads as a diagram. If you wanted a diagram, work in Register B with intent. If you wanted a captured product state, this is the symptom of accidental drift — recalibrate scale and product density.

### Principle: Density With Focus

The subject should contain enough product detail to feel real: rows, chips, icons, avatars, tiny labels, timestamps, badges, controls, dividers, and selected states.

Do not make every detail equally loud. The reference look depends on focus:

- one selected element is crisp
- neighboring elements are dimmer
- outer rows fall toward black
- context exists but recedes
- the story is carried by hierarchy, not callouts

If the UI looks easy to describe as "three generic rows in a card," it is under-detailed.

### Archetypes

Choose an archetype before designing. Do not start from a generic card.

#### A.1 — Product Picker / Selected Row

Use when the idea is delegation, assignment, choosing an agent, choosing a mode, or selecting a path.

Look:

- one centered panel
- command-like header
- four to six rows
- one selected row with stronger text and a quiet fill
- trailing checkmark or small selected marker
- other rows fade downward or outward
- optional slim accent cursor in the header

Avoid:

- equal-weight rows
- big colorful logos
- large explanatory labels
- selected state that looks like a button

Pass condition: the reader can identify the chosen option before reading the caption.

#### A.2 — Floating Issue Table / Chip Field

Use when the idea is orchestration, parallel work, multiple records, triage, or operating at scale.

Look:

- no heavy outer table container
- rows built from pills, issue IDs, status chips, avatars, dates
- two active rows in focus
- surrounding rows and columns fade into darkness
- tiny semantic dots and icons
- strong horizontal alignment

Avoid:

- a full dashboard table
- large cards around every row
- colorful category fills
- perfect uniform opacity

Pass condition: it feels like a real work queue caught mid-operation, not a spreadsheet illustration.

#### A.3 — Context Menu Over Dimmed UI

Use when the idea is handoff, opening in another tool, choosing an action, or revealing capability.

Look:

- foreground menu is crisp
- background toolbar or panel is visible but suppressed
- one highlighted row, charcoal not bright
- monochrome icons
- section label in muted text
- menu large enough to be the subject

Avoid:

- floating menu with no source context
- bright accent highlight
- oversized icons
- too much background detail

Pass condition: the menu feels opened from a real product surface.

#### A.4 — Layered Product Scenario

Use when the idea needs cause and effect: a conversation becomes an issue, a request becomes a task, an agent creates a record, or one surface produces another.

Look:

- wide frame is allowed
- two related surfaces can overlap
- foreground card carries the story
- background surface is larger, dimmer, and partially occluded
- content fades near edges
- caption remains bottom-left inside the frame

Avoid:

- two unrelated panels side by side
- diagonal collage layout
- equal visual weight
- overexplaining with arrows

Pass condition: the reader senses "this came from that" without needing labels.

If the essay needs to make the causal link between a specific row in one surface and a specific row in another *explicit* — naming which row produced which row — escalate to Register B's B.2 (Layered Cause-and-Effect Trace) instead.

#### A.5 — Command Composer

Use when the idea is intent, prompt-to-action, or a human request entering the system.

Look:

- one large rounded composer
- text line is prominent
- toolbar icons are small and muted
- send control is the only strong action
- optional mention chip
- optional dim layer behind composer

Avoid:

- chat bubbles
- multiple prompts
- giant send buttons
- an empty black form with no toolbar detail

Pass condition: it feels like a command is ready to become an operation.

#### A.6 — Integration Grid

Use when the idea is ecosystem, connectors, or routes from many tools.

Look:

- grid of dark brand tiles
- center row or center tile is sharpest
- outer tiles fade to 20-40 percent opacity
- marks are monochrome unless inline product context requires native color
- no tile dominates

Avoid:

- logo wall
- colorful SaaS collage
- equal-brightness grid
- a single brand mark as hero

Pass condition: the ecosystem feels broad, but the composition stays quiet.

#### A.7 — Abstract Connection Motif

Use only when a product state would be too literal.

Use A.7 for dark, numbered, in-essay symbolic figures. Use Register C only for cover/header/thumbnail/opening assets. If the visual must support a specific claim inside the essay body, prefer A.7 or Register B.

Look:

- two or three simple nodes
- thin braided line or waveform
- low-opacity accent
- large negative space
- no labels except figure label and caption
- restrained glow

Avoid:

- network diagrams
- particle fields
- brain/robot imagery
- thick neon lines

Pass condition: it feels like a technical signal, not a decorative background.

#### A.8 — Status / SLA Sequence

Use when the idea is state, escalation, health, deadline, breach, or run-time condition.

Look:

- small row of state icons or markers
- one state is selected or annotated
- mono annotation can sit below with a fine connector
- colors encode status only
- large empty field around the sequence

Avoid:

- big emoji-like icons
- rainbow timeline
- large labels on every state
- decorative flames or alert art

Pass condition: the selected state is unmistakable and the rest stays quiet.

### Prompting Rules For Image Agents (Register A)

When asking an image model for a Register A visual, give it art direction before tokens.

```text
Create a dark product-evidence editorial figure.

It should feel like a polished product-marketing screenshot from serious software: near-black canvas, one concrete UI state, realistic product density, subtle fade into darkness, sparse functional color, and a bottom-left caption.

Archetype: {choose one of A.1-A.8 from DESIGN.md}
Subject: {specific product state}
Canvas: square, near-black #08090A.
Composition: subject centered horizontally and biased upper-middle; subject width {60-75% for product UI, 50-65% for abstract motifs}; bottom-left caption; tiny top-left figure label.
UI feel: compact rows, small icons, chips, avatars or metadata where useful, subtle borders, selected state in focus, inactive context fading toward black.
Color: mostly neutral. Use #FF7133 only as one tiny functional accent. Status colors only as tiny state markers.
Caption: {headline} / {body}
Figure label: FIG. {X.Y}

Avoid: generic AI symbols, decorative gradients, blobs, stock illustration, equal-weight rows, oversized cards, colorful logo walls, obvious mockup-kit styling.
```

Do not rely on a prompt that only lists colors, radii, and typography. That produces compliant but lifeless images.

### Deterministic SVG Rules (Register A)

SVG can work for sharp diagrams, but it is risky for Register A because it tends to become too clean and schematic — which would shift the image into Register B by accident. If a figure starts feeling like Register B, ask whether Register B would have served the essay better and switch deliberately rather than fighting the medium.

If creating SVG programmatically for Register A:

- build from an archetype, not a generic panel
- make the subject larger than feels comfortable at first
- use masks or opacity ramps for edge falloff
- include more product density than a diagram needs
- vary row opacity and emphasis
- avoid repeated same-size cards
- avoid perfectly centered vertical compositions
- export and compare against references at actual display size

The Register A failure mode is "technically correct but emotionally flat." If the image looks like a component demo, add product evidence and fade, then recalibrate scale.

### Register A Failure Modes

- **Token-sheet compliance**: colors and radii are correct, but the image has no product realism.
- **Tiny subject**: the panel floats politely in the middle and feels unimportant.
- **Tiny caption**: the bottom text feels like metadata instead of editorial composition.
- **Generic rows**: three clean rows with icons and labels, no real product density.
- **Equal opacity**: everything is equally visible, so there is no staged focus.
- **No fade**: the UI ends at hard edges instead of dissolving into the black field.
- **Too symmetrical**: the frame feels like a centered diagram, not a captured state (this is accidental Register B — switch deliberately if a diagram is actually what the essay needs).
- **Over-clean SVG**: every stroke is perfect and every element has the same visual grammar.
- **Color drift**: indigo, blue, purple, teal, or orange all compete as accents.
- **Logo dependency**: the visual borrows brand recognition instead of structure.

### Pass / Fail Rubric — Register A

Before a visual ships, score it against this rubric. A public visual should pass every critical item and score at least 16 out of 20.

Critical gates:

- It uses a recognized A archetype.
- It shows one concrete product state.
- It does not copy Linear logos, proprietary layouts, or exact UI content.
- It does not use generic AI decoration.
- It does not introduce a second public accent color.

Scored checks, 0-2 each:

1. **Product evidence**: Does it feel like a real software state rather than a diagram?
2. **Scale**: Is the subject large enough, usually 60-75 percent of the frame?
3. **Caption weight**: Does the caption feel intentionally composed and readable?
4. **Focus**: Is one element clearly in focus while supporting context recedes?
5. **Density**: Are there enough product details to avoid generic-card syndrome?
6. **Fade**: Do inactive edges or background layers dissolve into darkness?
7. **Color restraint**: Is accent color tiny, functional, and below 3 percent?
8. **Depth**: Are borders, highlights, and shadows subtle rather than mockup-like?
9. **Typography**: Does text hierarchy match the reference scale and tone?
10. **Quietness**: Does the final image breathe without feeling empty?

Score guide:

- 18-20: publishable
- 16-17: usable after small refinements
- 13-15: directionally right but needs another pass
- 0-12: restart from the archetype, or reconsider whether Register B would have worked better

## Part B — Role / Flow Diagram Register

The relationship register. Use it when the argument is about how moments connect — handoff, control flow, role separation, governance boundary, before/after, sequence — rather than about a single moment.

### When to Use Register B

- Humans set intent; agents execute; the product enforces consent (canonical FIG. 0.4 reference)
- A row in one surface causes a row in another surface (canonical FIG. 0.3 reference)
- A system has actors around it that need to be named
- A protocol or lifecycle has ordered steps
- Trust, permission, or scope boundaries need to be visible
- The same product runs at build-time and run-time and the boundary is the point
- The reader needs to see the wiring before they can read a single product surface

If you cannot show the idea inside one product state, you need Register B.

### Principle: Labels Are Structure

Register B uses small text above panels to name roles, zones, or stages. These labels are part of the figure, not decoration. They behave like axis labels — quiet, structural, never competing with the panel's own internal header.

- Role labels (`Human`, `Agent`, `Product`): 20-26 px sans, metadata text color `#8A8F98`, positioned 16-24 px above the panel.
- Stage labels in sequence diagrams (`Submit`, `Review`, `Apply`): same treatment.
- Zone labels in boundary diagrams (`Inside` / `Outside`, `Build-time` / `Run-time`): same treatment, optionally with a thin 1 px boundary line in `rgba(255,255,255,0.07)`.

Avoid:

- heavy or all-caps role labels
- bright label colors
- decorative dividers under labels
- labels larger than the caption headline

### Principle: Connectors Carry Cause-and-Effect

Connector lines are the central mechanic of Register B. They carry meaning, so they need restraint.

- Default neutral line: 1 px, `rgba(255,255,255,0.11)`. Used for context relationships.
- Active path: 1 px, `#FF7133`. Used for the single most important flow in the figure. Only one orange line per figure — the orange budget rule from Shared Foundations still holds.
- Dashed line: 1 px, neutral or orange, dash pattern roughly 4-4 or 6-4. Used only for indirect, implied, or intent flows (e.g. a human sets intent for an agent it doesn't directly call).
- Endcaps: a small 4-6 px circle or dot is preferred over arrowheads. Arrowheads are allowed only when direction is genuinely ambiguous without them, and should be small open triangles, not filled.
- Routing: 90-degree bends with small rounded corners, or a single straight diagonal — never freeform curves.
- Anchoring: a connector should touch the edge of its source and target with intent — anchored to a specific row, control, or icon inside the panel, not floating in dead space.

If the figure has more than one orange connector, you have lost the active path. Demote all but one to neutral.

### Principle: Placeholder Content Is Acceptable

Register B trades content fidelity for structural clarity. Inside each labeled panel, content may be abstracted into low-opacity gray bars so the reader focuses on which panel does what, not what it says.

- Gray bars: `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.10)`, height 6-12 px, varying widths.
- Use sparingly. Every labeled panel must contain at least one recognizable product fragment (a labeled form field, a row with a real label, a button shape, a status chip) so the panel does not collapse to a Visio rectangle.
- The active path's source and target should be the most recognizable product fragments in the figure — readers need to see what is being connected.

### Principle: Density Still Lives Inside Labeled Boxes

Register B is not permission to draw flat boxes with text. Each labeled box should feel like a cropped fragment of a real product surface — with the same dark fill, subtle border, top-edge highlight, and 12-20 px radius as Register A floating surfaces.

- Panel fill: `#0F1011` to `#191A1B`.
- Border: 1 px `rgba(255,255,255,0.07)`.
- Top-edge highlight: 1 px white at 4-7 percent opacity.
- Radius: 12-20 px (smaller for narrow context panels, larger for foreground subjects).

A labeled panel with no border, no highlight, no radius, and no recognizable product fragment is a diagram cell, not a Register B panel. Reject and rebuild.

### Archetypes

Choose an archetype before designing.

#### B.1 — Role / Actor Diagram

Use when the idea is that two or three distinct roles share an operation (Human / Agent / Product, Operator / System / Customer, Author / Reviewer / Publisher).

Look:

- two or three labeled panels arranged horizontally or in an L (two left, one right, etc.)
- each panel has a quiet role label above it
- each panel contains a real product fragment — a card, a row, a small composer, a form
- thin neutral lines connect panels where context flows
- one orange line carries the active path (e.g. human intent → agent action → product enforcement)
- optional dashed line for indirect or intent flows
- caption bottom-left names the operating principle, not the diagram

Avoid:

- equal-emphasis lines between every panel
- filled brand-colored panels per role
- big headline-sized labels above panels
- Visio rectangles with no internal product detail

Reference: `c4/` for system-context anchoring; `stripe/` and `notion/` for restraint; the FIG. 0.4 "Two operators" figure is the canonical target.

Pass condition: the reader can name who does what and which role carries the active flow, before reading the caption.

#### B.2 — Layered Cause-and-Effect Trace

Use when one product surface produces another and the causal link between specific rows is the point. This is Register A's A.4 with an explicit connector added — when the implicit version cannot carry the argument.

Look:

- a larger background product surface, partially dimmed (50-60% brightness)
- a smaller foreground surface, in focus, with its own border and top-edge highlight
- a single orange connector traces from a specific row or control on the background to a specific row or control on the foreground
- surrounding content fades toward black
- caption bottom-left explains the causal relationship

Avoid:

- multiple orange lines between layers (use one; demote others to neutral or remove)
- a foreground that fully obscures the background (the source row must remain visible)
- decorative connector curves
- role labels above each layer (the layering itself is the structure; labels would be redundant)

Reference: `03_Content-Pipeline/_visuals/references/linear/048-dark-workflow-diagram-showing-product-creating-a-new-issue-that-passes-to-a-linear-agent.png` and related Linear workflow images; the FIG. 0.3 "Control moves upward" figure is the canonical target.

Pass condition: the reader can trace exactly which row in the background produced which row in the foreground.

#### B.3 — System Context Map

Use when the essay needs to establish the world before zooming in: one system, the actors around it, the external dependencies it touches.

Look:

- one central labeled panel representing the system in focus
- two to five smaller labeled nodes around it (users, agents, external services, data stores)
- each connector is a thin neutral line with a small endcap and an optional short verb label (`reads from`, `writes to`, `delegates to`) at most three words
- one active connector may be orange if the essay's point is which relationship matters most
- the central system should be the most product-real fragment; outer nodes can be simpler but should still carry a tiny UI or content cue, not only a text label

Avoid:

- verb labels longer than three words
- equal-weight nodes (the central system should read as primary)
- decorative grouping shapes around clusters of nodes
- bright per-actor colors

Reference: `03_Content-Pipeline/_visuals/references/c4/006-a-system-context-diagram.png`, `03_Content-Pipeline/_visuals/references/c4/120-c4-interactive-system-context.svg`, `03_Content-Pipeline/_visuals/references/mcp/121-mcp-host-client-server-architecture.svg`.

Pass condition: the reader can name the central system, its actors, and which actor relationship is in focus, before reading the caption.

#### B.4 — Sequence / Flow Trace

Use when the idea is ordered: a protocol, a lifecycle, a request as it moves through stages, an event as it propagates.

Look:

- three to six labeled stages arranged horizontally or vertically
- each stage has a quiet stage label above it (`Submit`, `Review`, `Apply`, `Audit`)
- each stage contains a small product fragment showing what happens there (a form field, a row, a status chip)
- thin neutral connectors between stages, in flow direction
- one stage is the focal stage — its panel is brighter, its inbound connector is orange
- stages before and after the focal stage may fade slightly toward the edges of the canvas
- caption bottom-left names what happens at the focal stage and why it carries the argument

Avoid:

- rainbow per-stage colors
- equal-weight stages with no focus
- a long timeline-style horizontal rule under all stages
- filled triangular arrowheads on every connector

Reference: `03_Content-Pipeline/_visuals/references/stripe/141-stripe-bank-transfer-sequence-1.jpg`, `03_Content-Pipeline/_visuals/references/stripe/143-stripe-bank-transfer-sequence-3.jpg`, `03_Content-Pipeline/_visuals/references/notion/063-notion-authorization-access-confirmation.png`.

Pass condition: the reader can name the sequence, the focal stage, and what happens there, before reading the caption.

### Prompting Rules For Image Agents (Register B)

When asking an image model for a Register B figure, give it the register before the archetype.

```text
Create a dark Role/Flow Diagram editorial figure.

It should feel like a documentation figure from serious infrastructure docs: near-black canvas, two or more labeled panels, restrained connector lines, one orange active path, gray-bar placeholder content where structure matters more than copy, and a bottom-left caption.

Archetype: {choose one of B.1-B.4 from DESIGN.md}
Subject: {what the figure argues about — handoff, role split, system context, sequence}
Canvas: square or landscape (landscape preferred for two-or-three panel layouts), near-black #08090A.
Composition: panels arranged for the chosen archetype; bottom-left caption; tiny top-left figure label.
Panel feel: each labeled panel is a real product fragment with dark fill #0F1011-#191A1B, 1 px border rgba(255,255,255,0.07), 12-20 px radius, top-edge highlight, and at least one recognizable UI element (form field, row, button). Internal content can be abstracted into low-opacity gray bars.
Panel labels: quiet sans, metadata gray #8A8F98, positioned above each panel.
Connectors: 1 px lines. Neutral rgba(255,255,255,0.11) for context, #FF7133 for the one active path. Optional dashed for indirect/intent. Small dot or circle endcaps preferred over arrowheads. 90-degree bends with rounded corners.
Color: mostly neutral. One orange active line. Status colors only as tiny state markers inside panels.
Caption: {headline} / {body}
Figure label: FIG. {X.Y}

Avoid: Visio rectangles, equal-weight connectors, rainbow stages, bright per-role colors, decorative grouping shapes, full-canvas gradients, robot/brain icons, sparkles, oversized arrowheads, brand logos as panel headers.
```

Do not rely on a prompt that only lists archetypes. Name the active path and what it carries.

### SVG and Diagram-Tool Notes (Register B)

Register B maps cleanly to SVG, Mermaid, PlantUML, and Excalidraw exports. The risk is that these tools default to looks (Mermaid's pastel boxes, PlantUML's classic UML grays, Excalidraw's sketchy strokes) that contradict the dark-stage-with-restraint feeling.

If exporting from a diagram tool:

- Theme to dark first. Mermaid supports a dark theme with custom CSS; PlantUML accepts a skinparam file. Use the Shared Foundations palette.
- Replace default arrowheads with small dots or no endcaps where possible.
- Replace pastel fills with the Register B panel fills.
- Strip default fonts to Inter or SF Pro.
- After export, expect to overlay or post-process: real product fragments inside the panels often need to be composited, since diagram tools cannot render UI internals.
- Mermaid and PlantUML are best for B.3 (system context) and B.4 (sequence). They struggle with B.1 and B.2, where labeled panels need real product fragments inside — those are better composed in a design tool.

### Register B Failure Modes

- **Visio rectangles**: labeled boxes with no border, no highlight, no internal product fragment. The figure reads as a slide template.
- **Connector overload**: multiple orange connectors compete for the active path; the reader cannot tell which flow is the point.
- **Floating endpoints**: connector lines start or end in dead space instead of anchoring to a specific row or control inside a panel.
- **Headline labels**: panel role labels render as bold white headings, competing with the panel's own internal header and the figure caption.
- **Rainbow stages**: each stage of a sequence gets its own brand-style color, breaking the neutral-heavy palette.
- **Visible diagram-tool defaults**: classic UML stickman, default Mermaid pastel fills, Excalidraw sketchy strokes leaking through.
- **No product evidence inside panels**: the figure reads as architecture porn — geometrically clean but emotionally empty.
- **Brand-mark panel headers**: a panel labeled with a logo instead of a role name turns the figure into a brand wall.

### Pass / Fail Rubric — Register B

Before a figure ships, score it against this rubric. A public visual should pass every critical item and score at least 16 out of 20.

Critical gates:

- It uses one of the four B archetypes.
- It names the active path with exactly one orange connector (or zero, if the figure is pure context).
- Each labeled panel contains at least one recognizable product fragment.
- Panel role labels are quiet sans in metadata gray, not headlines.
- It does not introduce a second public accent color.

Scored checks, 0-2 each:

1. **Register fit**: Is Register B the right choice for the argument, or could Register A have carried it inside one moment?
2. **Active path clarity**: Can the reader identify the orange flow before reading the caption?
3. **Panel realism**: Does each labeled panel feel like a cropped product fragment, not a diagram cell?
4. **Connector restraint**: Are connectors thin, neutral by default, with small endcaps?
5. **Label hierarchy**: Are panel labels quieter than the caption and quieter than internal panel headers?
6. **Placeholder discipline**: Where gray-bar placeholders appear, do they sit alongside at least one real product fragment?
7. **Fade**: Do peripheral panels and unrelated content dissolve into darkness?
8. **Color restraint**: Is accent color one line, under 3 percent of the frame?
9. **Anchored endpoints**: Do connector lines anchor to specific elements inside panels, not float in dead space?
10. **Quietness**: Does the figure breathe like a Register A frame, or feel busy and over-explained?

Score guide:

- 18-20: publishable
- 16-17: usable after small refinements
- 13-15: directionally right but needs another pass
- 0-12: restart from the archetype, or reconsider whether Register A would have worked better

## Part C - Gradient Glass Signal Variant

The brand-glass header register. Use it when the visual needs to introduce a concept, feature, or agentic capability with atmosphere and motion, rather than prove a detailed product claim. This register is based on the object grammar in `03_Content-Pipeline/_visuals/references/glassmorphism/` and the fixed background in `03_Content-Pipeline/_visuals/brand/brand-background.png`.

Register C is not the default style for the wiki. It is a controlled variant for wide blog-header visuals, thumbnails, section openers, prompt cards, and concept images where the goal is: "make this feel like an intelligent product system coming alive."

### Reference Classification

Per-image content, trait, and clone-prompt analysis lives in `03_Content-Pipeline/_visuals/glass-visual-analysis.md`.

The glassmorphism set breaks into six useful families plus two caution references:

- **Live Signal / Audio State:** `03_Content-Pipeline/_visuals/references/glassmorphism/agent-online.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/realtime-perplexity-computer.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/updates-audio-blog.webp`. These use a waveform or audio line as the central evidence of live operation. `03_Content-Pipeline/_visuals/references/glassmorphism/updates-audio-blog.webp` is hybrid because it also includes layered audio panels.
- **Orbit / Capability Field:** `03_Content-Pipeline/_visuals/references/glassmorphism/responses-api.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/run-long-horizon-tasks-with-codex.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/skills-shell-tips.png`. These use rings, overlaps, circular paths, and small tool chips to show capabilities interacting.
- **Glass Command / State Pill:** `03_Content-Pipeline/_visuals/references/glassmorphism/designing-beautiful-frontends.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/codex-jetbrains.png`. These use one large translucent pill with a short verb phrase such as `Generate`, `Fixing...`, or `Reviewing...`.
- **Layered Product / File Panels:** `03_Content-Pipeline/_visuals/references/glassmorphism/codex-for-documentation-dagster.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/eval-skills.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/apps-blog-visual.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/designing-beautiful-frontends.png`, `03_Content-Pipeline/_visuals/references/glassmorphism/updates-audio-blog.webp`. These abstract real product surfaces into glass windows, file cards, status panels, audio panels, and command overlays.
- **API / Network Burst:** `03_Content-Pipeline/_visuals/references/glassmorphism/one-year-responses.png`. This uses a glass source label as the origin of many faint outbound routes, implying ecosystem reach without drawing a literal architecture diagram.
- **State Chain / Workflow Handoff:** `03_Content-Pipeline/_visuals/references/glassmorphism/codex-at-devday.png`. This uses two or three state objects linked by a route to show abstract progress, not detailed governance flow.

Caution references:

- `03_Content-Pipeline/_visuals/references/glassmorphism/15-lessons-chatgpt-apps.png` is useful for overlapping circles and soft color, but weak on product evidence. Do not use it alone as a Register C target.
- `03_Content-Pipeline/_visuals/references/glassmorphism/openai-for-devs-2025.png` is a dark command-pill outlier and the closest reference to the wiki's fixed brand background. Use it as a reference for a muted search/state pill over texture, not as permission to create a new background.

### Common Characteristics

Across the set, the look comes from hierarchy, not from any single glass effect. The order is: **signal first, product clue second, glass third, background last**.

- **Wide product-blog canvas:** almost every reference is a panoramic banner around 1600 px wide and 590-602 px tall.
- **Fixed brand background:** public wiki versions must use `03_Content-Pipeline/_visuals/brand/brand-background.png`. The colorful aurora fields in the references are composition references only.
- **Subtle grain and hatching:** the brand background already supplies a dark texture field. Do not add colorful background layers to replace it.
- **White-line technical geometry:** 1-2 px white strokes, rings, rounded circuit paths, waveform lines, dotted matrices, diagonal hatching, dashed grid lines, and fine horizon lines.
- **Translucent glass objects:** pills, windows, cards, files, and circular nodes use low-opacity white fills, blur-like softness, faint highlights, and thin white borders.
- **One central product signal:** a waveform, command pill, file state, code panel, model/tool orbit, or API burst carries the image. The rest is atmosphere.
- **Primary label restraint:** one to three short primary labels at most. Labels are product-state words, not explanatory captions.
- **Optional UI microcopy:** tiny internal text is allowed inside product panels when it behaves like evidence (`Problems · 1`, `Tests · passed`, `Results.pdf`, `00:35`). Do not let microcopy become the headline.
- **White UI iconography:** icons are simple line symbols inside glass: cursor, terminal, search, image, audio, file, chart, globe, workflow, plus sign.
- **Cursor as agency cue:** several references use a large white outline cursor to imply human/agent action. Use it sparingly; it should point to the active object, not decorate the corner.
- **No hard product screenshot:** product evidence is abstracted into plausible windows, files, code lines, and status chips rather than copied screenshots.
- **No fancy color system:** do not import the reference set's blue, cyan, lavender, pink, orange, or green gradient fields. Use color only as tiny functional accent, with `#FF7133` as the public accent.

### When to Use Register C

- An asset slot specifically needs an atmospheric cover, header, thumbnail, opening image, or prompt card.
- The concept is about live operation: agent online, realtime signal, voice/audio, thinking, planning, reviewing, fixing, evaluating.
- The argument is about capability space: tools, skills, APIs, routes, integrations, or a model coordinating multiple actions.
- The visual needs an abstract two-or-three-state motion path, not a detailed workflow explanation.
- The visual should feel optimistic, modern, and technical without becoming a marketing splash page.
- The image needs to be legible as a thumbnail while still feeling product-native.

Use Register C sparingly. A/B-derived dark visuals remain the default even for public posts when the argument benefits from product evidence or role/flow clarity.

Avoid Register C when the claim needs proof, governance detail, source-backed evidence, precise role separation, or a readable explanatory workflow. Use Register A or B for those.

### Principle: Header, Not Diagram

Register C is header-grade product atmosphere, not a glass version of Register B. It should compress the argument into one visible product/system signal and one supporting clue. If the image needs to explain the whole thesis, map five rules, compare roles, label zones, or show a readable process, switch to Register B.

Useful test: remove the surrounding essay. The visual should still feel like an intelligent product state is happening, but it should not read as a complete explanatory slide.

Hard budgets:

- One dominant object family only: waveform, orbit, command pill, file/panel, route burst, or state chain.
- One linked product clue: file, row, output card, status pill, waveform time marker, or named route source.
- One linework family only: waveform, orbit rings, rounded route, dotted matrix, diagonal hatching, dashed route, or hairline routes.
- One background texture at most.
- One medium/large panel, except C.4 where two layered panels are allowed.
- One to three primary labels total.
- No full-width process maps, rule-slot sequences, governance matrices, role diagrams, zone labels, or multi-step policy explanations.

When tempted to add a second explanation layer, rewrite the concept into a smaller signal. For example, "run-time governance is missing" can become a `Blocked` command plus one tiny `Audit packet` card. It should not become five labeled governance gates.

### Principle: Labels Are Product States

Register C labels should feel like interface states, not thesis labels. Prefer verbs, status words, artifact names, and compact product nouns.

Prefer:

- `Reviewing...`
- `Blocked`
- `Run log`
- `Audit packet`
- `Output`
- `Using skill`
- `Agent online`
- `Create task`

Avoid as primary labels:

- rhetorical questions such as `May do?` or `Owner?`
- essay concepts such as `Human UI`, `Run-time layer`, or `Governance gap`
- explanatory microcopy such as `rules blank`, `permission model missing`, or `agent inside product`
- labels that name every stage in a process

If an abstract concept must appear, demote it to tiny product microcopy inside a panel or add it later as article text outside the image.

### Principle: Signal Leads The Image

Glass is not the subject. The signal or state is the subject.

Build the composition in this order:

1. **Dominant signal:** waveform, state pill, file handoff, orbit core, route burst, or workflow state.
2. **Linked product clue:** command, file/code panel, status label, output card, waveform with time/state, or named route.
3. **Glass support:** translucent pills, panels, nodes, or cards that hold the signal.
4. **Background field:** fixed brand background, faint geometry, and texture.

If the background or glass is the first thing the viewer notices, the image is probably wallpaper. Rebuild around the signal.

If the labels or route structure are the first thing the viewer notices, the image is probably a diagram. Rebuild around a smaller state object.

Layer stack:

- background lightfield
- faint geometry or texture
- symbolic product surface
- active state object
- cursor or icon on top only when it points to the active object

### Principle: Brand Background Is The Material

The background is a fixed dark brand field. It should feel like product glass sitting on top of the wiki's own surface, not like a copied launch graphic or a fresh colorful wallpaper.

- Use `03_Content-Pipeline/_visuals/brand/brand-background.png` as the exact background plate for public Register C visuals.
- Preserve the dark neutral field, subtle diagonal texture, and soft edge falloff of the brand background.
- Add only foreground glass, white technical linework, labels, icons, product fragments, and optional tiny `#FF7133` functional accents.
- Keep the center behind the subject readable by locally dimming or strengthening glass objects, not by repainting the background.
- Let the brand background show through translucent glass objects.
- Keep grids, hatching, and dotted fields faint enough that they read as foreground technical texture rather than a replacement background.

Avoid:

- colorful aurora fields copied from the references
- hard radial blobs
- bokeh dots as decoration
- sharp rainbow bands
- full-saturation neon
- full-canvas grids or hatching that compete with the focal signal
- orange, purple, cyan, green, or blue background washes
- gradients that make white labels unreadable
- any background other than `brand-background.png` unless Leonardo explicitly asks for a reference-fidelity experiment

### Principle: Glass Is Thin, Not Chunky

The glass objects are translucent pieces of interface. They are soft but precise.

- Fill: white or color-tinted white at low opacity.
- Border: thin white stroke, often 12-35 percent opacity depending on background brightness; reserve 40-60 percent only for the one focal object.
- Highlight: a faint top or left edge, not a thick shine or glowing rim.
- Blur feeling: created by soft translucency and background color bleeding through; do not overdo frosted blur.
- Radius: generous on pills; moderate on windows and file cards.
- Shadow: minimal. Use local glow and edge contrast more than drop shadow.
- Glow: one restrained focal glow at most. Large luminous outlines make the object feel like plastic.

Avoid:

- heavy beveled plastic
- opaque blue cards
- glossy 3D buttons
- chunky shadows
- thick neon borders
- large frosted panels that look like dashboard cards
- "glass card dashboard" templates

### Principle: Product Evidence Stays Symbolic

Register C can be abstract, but it still needs a concrete product clue. A beautiful glass field with no product signal is off-brand for this wiki.

Useful product clues:

- a command pill with a verb phrase
- a code or terminal window
- a file card or folder shape
- a waveform with a time mark
- a status label such as `Agent online`, `Using skill`, `Output`, `Planning...`
- tool chips arranged around a system
- a cursor pointing at the active object
- a dotted matrix or grid that behaves like a product surface, not confetti

Use just enough literal UI to make the concept actionable.

Require a paired clue: one focal signal plus one linked product artifact or state. Cursor, dots, rings, grids, particles, routes, and icons do not count by themselves. Texture alone never satisfies product evidence.

The paired clue should be small. Product evidence in Register C is a fragment, not a full product screenshot or policy board.

### Principle: Motion Is Implied

The references feel active even though they are still images. They imply motion through signal, orbit, sequence, and route.

- Waveform means live audio, realtime input, or streaming state.
- Orbit rings mean tools or skills circling a core system.
- Dashed routes mean planning, review, or lightweight task handoff.
- Outbound starburst means API reach or distribution.
- Overlapping circles mean multimodal or multi-tool overlap.

Register C can show an abstract two-or-three-state motion path. Register B is still required for detailed role separation, governance detail, or explanatory workflows.

Avoid magic beams, sparkles, and sci-fi energy lines. This should feel like software motion, not fantasy motion.

### Archetypes

Choose one of these before prompting an image model.

For image generation, do not combine primitives from every archetype. Choose exactly one main object family, one linework family, and at most one background texture.

#### C.1 — Live Signal / Waveform

Use when the idea is realtime operation, voice, audio, streaming, or agent presence.

Look:

- one white waveform crossing the frame horizontally
- optional dotted matrix behind the waveform
- one or two glass pills naming the state (`Agent online`, `Realtime API`, `Create task`)
- optional small time marker
- optional tiny `#FF7133` action glow may sit near the active action

Pass condition: the image reads as a live signal before the viewer reads any label.

#### C.2 — Orbit / Capability Field

Use when the idea is tools, skills, models, modes, or capabilities interacting around a core.

Look:

- central glass node or icon
- two to four orbit rings or partial arcs
- small chips or icons placed on the rings
- one command/state pill attached to the system
- optional dotted horizon line through the center

Pass condition: the image feels like capabilities coordinating, not planets orbiting for decoration.

#### C.3 — Glass Command / State Pill

Use when the visual needs one crisp agentic action: thinking, planning, fixing, reviewing, generating, evaluating.

Look:

- one large translucent pill near center
- short state phrase in white sans, usually one to three words
- one line icon on the left
- optional large cursor pointing at the pill
- one tiny linked artifact or state clue, such as a file chip, output dot, tool icon, or small panel edge
- simple geometric texture behind it: hatching, dotted field, or faint grid

Avoid turning the command into a workflow. A route may leave the pill, but it should not lead through several explained objects or rule slots.

Pass condition: the state phrase and the action cue are legible at thumbnail size.

#### C.4 — Layered Product / File Panels

Use when the concept needs a product artifact without showing a full screenshot: documentation, code, output, files, skills, frontends.

Look:

- one or two translucent browser/file panels
- simple code lines, file names, status rows, or output cards inside
- one command pill floats over the panels
- thin connectors may link panels
- diagonal hatching can mark generated or pending areas

Avoid rendering a full policy table, governance matrix, or explanatory product board. The panel is an artifact clue, not the argument.

Pass condition: the viewer understands what kind of artifact is being worked on.

#### C.5 — API / Network Burst

Use when the idea is reach, routes, integrations, requests, responses, or ecosystem distribution.

Look:

- one glass source label on the left or center-left
- 12-24 thin white routes spreading toward a faint node cloud
- 6-10 visible endpoint nodes, with tiny icons inside only a few nodes
- glow remains restrained; routes are hairlines, not beams
- surrounding dots are sparse, structured, and connected to the route field; no random starfield

Avoid making the route burst into an architecture diagram. The source label and route field should imply reach, not enumerate the system.

Pass condition: it reads as API reach or system connectivity, not a generic particle explosion.

#### C.6 — State Chain / Workflow Handoff

Use when the idea is lightweight progress across two or three states: planning to review, review to merge, input to output, draft to published.

Look:

- two or three glass state objects arranged diagonally, stepped, or in a loose loop
- each state has one short primary label (`Planning...`, `Reviewing...`, `Merged`)
- one thin route links the states, with optional dashed segment for indirect work
- background grid or hatching can imply system structure
- one state is visually dominant; the others support it

Avoid:

- more than three states
- detailed role labels
- dense explanatory workflow copy
- a full process map disguised as glass
- governance gates, rule sockets, or decision matrices

Pass condition: the viewer sees motion from one state to the next without mistaking it for a governance diagram.

### Prompting Rules For ChatGPT Imagen 2 (Register C)

When asking ChatGPT Imagen 2 for this variant, name the register and archetype first. Then lead with the concrete scene before style. Imagen will drift toward generic glassmorphism if the prompt starts with atmosphere.

```text
Create a wide Gradient Glass Signal editorial header.

Archetype: {choose one of C.1-C.6 from DESIGN.md}
Rendered scene: {one concrete archetype-specific scene, e.g. one file window, one output card, and one command pill; or one waveform with one state pill and one time marker}
Concept, not rendered as text: {the concrete concept, feature, workflow state, or agent action}
Exact rendered primary labels: {1-3 short labels only, e.g. "Reviewing...", "Output", "Audit packet"}
Optional tiny UI microcopy: {short product evidence only, or "none"}

Canvas: wide banner, approximately 1600x590 or 1600x602.
Composition: one central or slightly off-center dominant signal in the middle third; one small linked product clue; large atmospheric space around it; no bottom caption unless explicitly requested. Header, not diagram: do not explain the full argument, map a workflow, compare roles, label zones, or show policy gates.
Object family: {choose exactly one: waveform, orbit system, command pill, layered file/product panels, API route burst, or state chain}
Linework family: {choose exactly one: waveform line, orbit rings, rounded circuit path, dotted matrix, diagonal hatching, dashed route, or hairline network routes}
Background plate: use `03_Content-Pipeline/_visuals/brand/brand-background.png` as the exact background image. Do not generate or add a new colorful gradient.
Foreground texture: {choose at most one: faint grid, dotted field, diagonal hatching, or none}
Glass objects: translucent rounded pills, windows, file cards, or circular nodes with thin white borders, faint highlights, and the brand background subtly visible through them. Thin glass only; avoid thick glowing rims, opaque blue cards, or chunky frosted panels.
Technical linework: white 1-2 px strokes from the chosen linework family only.
Product evidence: include a paired clue: one focal signal plus one small linked artifact or state, such as a command pill plus file chip, waveform plus time/state, orbit core plus tool chip, route burst plus named source, or state chain plus output marker.
Text: primary labels must be product-state words, not essay claims. Use verbs, statuses, artifact names, and compact product nouns. Labels must sit inside darker translucent pills/panels or locally dimmed patches. Use readable white product sans; optional monospace only inside code/file panels.
Icons: simple white line icons for search, terminal, audio, image, file, chart, globe, cursor, workflow, plus, or model/tool nodes. No brand logos.
Color: keep foreground linework, icons, labels, and glass neutral white/gray. Do not add extra color fields. Use `#FF7133` only as a tiny functional action mark if the state requires it.
Brand transformation: do not use `OpenAI`, `ChatGPT`, `GPT`, `Codex`, `Responses API`, or copied launch wording. Change geometry, labels, icon set, and focal placement away from the references.

Avoid: colorful gradients, fancy colors, dark editorial figure frame, bottom-left caption by default, generic glass dashboard, stock AI symbols, robot heads, brains, sparkles, magic beams, bokeh dots, heavy shadows, glossy 3D plastic, copied OpenAI headers, OpenAI logos, unreadable tiny text, more than three primary labels, random particles, mixed archetypes, full process maps, rule-slot sequences, governance matrices, role diagrams, zone labels, and thesis labels.
```

Strong concept phrasing matters, but the concept sentence should not be rendered in the image. Prefer "agent reviews a run log and produces an audit packet" over "AI workflow." Prefer "design-system skill converts a component rule into an output file" over "future of design."

If exact text is important, generate the glass objects with blank label areas and add the final text later. Any misspelled or illegible rendered text fails the image.

### Calibration Probe Prompts

Use these after changing Register C guidance or before producing a new Register C batch. They are calibration probes, not canonical article copy.

#### Probe 1 — Command Pill Without Diagram Gravity

```text
Create a wide Gradient Glass Signal editorial header.

Archetype: C.3 — Glass Command / State Pill
Rendered scene: one large translucent command pill labeled "Blocked" floats slightly left of center, with a simple white cursor pointing at its right edge. A tiny glass file chip labeled "Run log" sits near the lower-right edge of the pill, connected by one short white hairline. A small dim output dot sits beyond the file chip, but do not draw a workflow, rule slots, or extra panels.
Concept, not rendered as text: an agent reaches a product action but stops because the run-time rule is not available.
Exact rendered primary labels: "Blocked", "Run log"
Optional tiny UI microcopy: none

Canvas: wide banner, approximately 1600x590 or 1600x602. Background plate: use `03_Content-Pipeline/_visuals/brand/brand-background.png` exactly. Composition: one dominant command pill, one tiny linked file chip, large atmospheric space. Header, not diagram. Object family: command pill. Linework family: rounded circuit path. Foreground texture: none beyond the brand background and one short rounded route. Glass objects: thin neutral translucent glass with restrained border and one tiny `#FF7133` action glow only if needed. Text: product-state words only, readable inside darker translucent objects.

Avoid: workflow map, five gates, policy matrix, role labels, zone labels, large product board, thesis labels, thick glowing rims, opaque blue cards, random particles, copied launch art, robot heads, brains, sparkles, magic beams.
```

#### Probe 2 — Route Burst Without Architecture Diagram

```text
Create a wide Gradient Glass Signal editorial header.

Archetype: C.5 — API / Network Burst
Rendered scene: one small glass source pill labeled "Local tool" sits center-left. From it, 14-18 thin white hairline routes fan toward a soft node cloud on the right. One small translucent card near the route endpoints is labeled "Activities" and contains only three neutral row marks plus one tiny time mark. Endpoint dots are sparse and connected to the route field; do not draw boxes for every endpoint.
Concept, not rendered as text: a simple local tool can reach structured product evidence.
Exact rendered primary labels: "Local tool", "Activities"
Optional tiny UI microcopy: "14:37"

Canvas: wide banner, approximately 1600x590 or 1600x602. Background plate: use `03_Content-Pipeline/_visuals/brand/brand-background.png` exactly. Composition: source pill left, route burst through the middle third, one small activity card as the linked product clue, large atmospheric space. Header, not architecture diagram. Object family: API route burst. Linework family: hairline network routes. Foreground texture: none beyond sparse connected endpoint dots. Glass objects: thin neutral translucent source pill, tiny activity card, and sparse endpoint nodes with faint borders.

Avoid: architecture map, labeled system boxes, dense endpoint inventory, particle explosion, thick neon beams, random unconnected dots, large dashboard card, workflow explanation, copied launch art, robot heads, brains, sparkles, magic beams.
```

### Register C Failure Modes

- **Pretty wallpaper:** background and glass are present, but there is no product signal.
- **Diagram gravity:** the image explains a workflow, policy, role map, or governance sequence instead of introducing one product/system state.
- **Glass-first composition:** the translucent objects are the subject instead of holding a concrete signal or state.
- **Consumer glass dashboard:** translucent cards look like a generic finance or weather app.
- **Copied launch art:** layout, label, or icon set is too close to an OpenAI reference.
- **Overwritten image:** more than three labels, long sentences, or unreadable UI copy.
- **Argument labels:** primary labels name the essay thesis instead of product states.
- **Foreground overload:** too many large panels, sockets, routes, or labels crowd out the atmospheric field.
- **No focal object:** rings, dots, and background texture compete without one central state.
- **Too much glow:** the image becomes neon sci-fi instead of product art.
- **Hard blobs:** decorative light blobs appear on top of or instead of the brand background.
- **Uncontrolled color:** saturated hues fight the foreground or replace the brand background.
- **Meaningless cursor:** a cursor appears but points at nothing active.
- **Copyable silhouette:** if labels were removed, the image would still read as an OpenAI launch header.

### Pass / Fail Rubric — Register C

Before a Register C image ships, score it against this rubric. A public visual should pass every critical item and score at least 18 out of 22.

Critical gates:

- It uses one C archetype, not a mashup of several.
- It is wide-format unless a specific crop is requested.
- It contains at least one product-shaped clue with a state or artifact: command pill, file/code panel, status label, output card, waveform with time/state, or named route.
- It shows a concept-specific action/object relation, not just mood. Example: agent reviews run log -> audit packet.
- It feels like a header or concept signal, not a workflow diagram, policy map, role map, or explanatory slide.
- Texture alone — dots, rings, grids, particles, routes, cursor, or icons — does not satisfy product evidence.
- It does not copy OpenAI logos, exact labels, or recognizable launch compositions.
- If labels are rendered, they are correctly spelled and legible.
- It is a header/concept visual, not a substitute for a detailed evidence figure.

Scored checks, 0-2 each:

1. **Concept clarity:** Can the viewer infer the product/system idea before reading surrounding article text?
2. **Focal signal:** Is there one central waveform, pill, panel, orbit, or route field?
3. **Glass quality:** Are glass objects translucent, precise, and lightly bordered rather than chunky?
4. **Background discipline:** Is the required brand background preserved without added colorful fields or hard blobs?
5. **Technical texture:** Do dots, hatching, rings, or linework add system meaning rather than decoration?
6. **Text restraint:** Are primary labels short, readable, and limited to one to three items, with only useful tiny UI microcopy?
7. **Product evidence:** Is there a paired clue: a focal signal plus a linked artifact or state, not just texture?
8. **Motion implication:** Does the composition imply signal, orbit, sequence, or routing?
9. **Header discipline:** Is the image free of diagram gravity, role/zone labels, policy gates, and full-workflow explanation?
10. **Brand adaptation:** Would it still avoid reading as OpenAI launch art if the labels were removed?
11. **Thumbnail strength:** Does the main idea survive when the image is reduced?

Score guide:

- 20-22: publishable
- 18-19: usable after small refinements
- 15-17: visually close but conceptually weak
- 0-14: restart from the archetype, or switch to Register A/B if the idea needs more evidence

## Practical Workflow

1. **Pick the register.** Does the argument live inside one product state (Register A), across several roles or steps (Register B), or as a wide concept/header signal (Register C)? If you can show it inside one product moment, choose A.
2. Pick the archetype within that register.
3. Write the product state (A), the active path (B), or the product/system signal (C) in one sentence.
4. Decide what is selected, active, breached, opened, or pending (A) — which roles, stages, or zones the figure names and which one carries the orange path (B) — or which waveform, command, panel, orbit, or route field carries the concept (C).
5. Choose the minimum accent use.
6. For A/B, compose subject, figure label, and caption together. For C, decide first whether the asset is a header/thumbnail with no caption or a numbered figure that must use the canonical label/caption.
7. Add realistic product density (A), panel-internal product fragments and connector hierarchy (B), or symbolic product clues inside the brand-glass field (C).
8. Add fade and opacity hierarchy.
9. Compare against at least two images in the relevant subfolder of `03_Content-Pipeline/_visuals/references/`; for Register C, also check `03_Content-Pipeline/_visuals/glass-visual-analysis.md` and confirm the background is `03_Content-Pipeline/_visuals/brand/brand-background.png`.
10. Score with the register's pass/fail rubric.
11. Revise until it feels like product evidence (A), operating wiring (B), or a product-native glass signal (C), rather than a generic diagram or wallpaper.

## Hard No

These reject across the system unless a register-specific rule explicitly allows a controlled exception.

- decorative blobs, bokeh, or visible gradient orbs; Register C uses the fixed brand background and may add only foreground glass or technical texture
- stock-feeling AI decoration
- robot heads, brains, sparkles, magic, or anthropomorphic agent imagery
- broad colorful backgrounds
- playful rounded consumer-app cards
- generic network diagrams chosen as decoration; system maps are allowed only as Register B, and route fields are allowed only as Register C.5 when they include a named product/source clue and sparse structured routes
- logo walls (Register A) or brand-mark panel headers (Register B)
- copied Linear layouts or proprietary content
- huge shadows or generic glassmorphism; Register C allows controlled translucent glass only when it follows the Gradient Glass Signal rules
- low-density generic dashboards (Register A) or Visio-style flat rectangles with no product fragment inside (Register B)
- captions that are too small to anchor the composition
- a second public accent color competing with orange in Registers A/B
- multiple orange connectors competing for the active path (Register B)
- copied OpenAI blog compositions, logos, or launch labels (Register C)
- foreground UI accent colors that compete with the neutral brand-glass field (Register C)
