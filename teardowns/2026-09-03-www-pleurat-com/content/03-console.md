> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 03 — Console / Workspace demo

EXTRACTED from `source/rendered.html:2355-2544` — `<section class="sv-wrap sv-pad sv-outro" id="contact">`.

## ⚠️ DOM naming oddity to flag

This section's `id` is literally `"contact"` and its class includes `sv-outro` (both names that strongly suggest a closing "get in touch" CTA block) — but its actual rendered content is the interactive fake-terminal "AI workflow" demo widget documented in `notes-bundles.md` §8 (component `Console-CyBRxdTz.js`, exported `bs`/`C`). There is **no contact form anywhere on the homepage** — `/contact` is a separate route (linked from nav). Do not confuse this section with an actual contact block when rebuilding; name it after what it contains (a workspace/console demo), not its DOM id.

## Content

### Top bar (`div.sv-cn-bar`)
- Traffic-light dots (decorative, `span.sq` with 3 `<i>`)
- Path breadcrumb text: `portfolio / workspace / workspace`
- Status pill: `Ready`

### Sidebar — "Expertise" (`aside.sv-cn-side`)
Heading: **Expertise**

| Item | Sub-label | State at capture |
|---|---|---|
| Workspace | Bench · Live | selected/active (`is-sel is-built`) |
| AI Workflow | Agents · Daily | — |
| Design System | Library · 12 parts | — |
| Product Design | End to end · 8+ yrs | — |

Progress readout: `1 / 4 opened`

### Canvas — flowchart mockup (`div.sv-cn-canvas`, SVG diagram)
Stageline label: `Workspace` / `Bench · Live`

A small hand-drawn decision-flow diagram with these node labels (EXTRACTED verbatim from `<text class="dg-t">` elements):
`Brief` → `Explore` → `In the / system?` → (yes) `Reuse` / (no) `New pattern` → `Add to lib` → `Ship`

Two annotation "sticky note" callouts layered over the diagram:
> Reuse before you add.
> Every new pattern is
> a thing somebody
> has to maintain.

> Empty state?
> ask design

A fake chat pane (`article.pane.chat`):
- Label: `Chat`
- User message: *"make the rail crop the second card"*
- AI reply, two lines: *"On it — a 24px reveal on the second."* / *"Editing WorkRail.tsx"*
- A signature/pointer tag reading `Pleurat`

Tag row below the canvas (`div.vars`): `figma` · `cursor` · `claude` · `live · never finished`

### Terminal log (`div.sv-cn-log`, typed command-log simulation)
```
· the portfolio — type `help`, or press a key below
❯ open workspace
· opening the workspace
· ↳ Ask for it, draw it, ship it.
· restoring the board — notes, shapes, what is open
✓ workspace live — it carries on without you
```

### Command prompt (`div.sv-cn-prompt`)
- Input placeholder: `try: open workspace`
- Quick-action buttons: `next` · `help` · `clear`

### Footer caption (`div.sv-cn-foot`)
> FIG. 004 — Four tracks, one bench
> Workspace, AI, systems, product — open one on the left

## Assets used in this section

None — the diagram, chat bubbles, and "ink" annotation layer are all inline SVG/DOM, no image files.
