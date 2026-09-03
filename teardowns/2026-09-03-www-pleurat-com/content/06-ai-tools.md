> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 06 — AI tools grid

EXTRACTED from `source/rendered.html:2862-2961` — `<section class="sv-wrap sv-pad" id="tools" data-badge="AI tools">`.

## Heading

> AI is part of how I **design & build**,
> every day.

## Sub-copy

> Not a novelty — a daily practice. These are the tools I reach for to move from a rough idea to a shipped, working product.

## Tool grid (`div.sv-tools`, 10 items)

| Name | Local asset | Notes |
|---|---|---|
| Claude | `assets/images/logo-claude.webp` | alt="Claude logo" |
| Figma | `assets/images/logo-figma.webp` | alt="Figma logo" |
| Cursor | `assets/images/logo-cursor.webp` | alt="Cursor logo" |
| Supabase | `assets/images/logo-supabase.webp` | alt="Supabase logo" |
| Vercel | `assets/images/logo-vercel.webp` | alt="Vercel logo" |
| OpenAI | `assets/images/logo-openai.webp` | alt="OpenAI logo" |
| Meta | *(none — no image asset)* | rendered as `<span class="ring" role="img" aria-label="Meta logo">`, a CSS-drawn ring shape, not a downloadable file |
| Grok | `assets/svg/logo-grok.svg` | alt="Grok logo" |
| GitHub | `assets/svg/logo-github.svg` | alt="GitHub logo" |
| Tailwind | `assets/svg/logo-tailwind.svg` | alt="Tailwind logo" |

Each tile fades/scales in via the shared stagger-reveal hook (`{from:.88, rise:18, start:.9, span:.5, overlap:.7}` per `notes-bundles.md`); several logos also carry a per-item inline `opacity` value at rest (e.g. Vercel `0.74`, Cursor `0.84`) — a subtle "recency/frequency of use" dimming effect rather than a load-state artifact.

This same 10-item tool list (minus "Meta", which has no image) is reused verbatim in the footer's "board-walk" marquee — see `content/09-footer.md`.

## Assets used in this section

`logo-claude.webp`, `logo-figma.webp`, `logo-cursor.webp`, `logo-supabase.webp`, `logo-vercel.webp`, `logo-openai.webp`, `logo-grok.svg`, `logo-github.svg`, `logo-tailwind.svg` (all in `assets/ASSETS.md`, REFERENCE-ONLY — third-party brand marks).
