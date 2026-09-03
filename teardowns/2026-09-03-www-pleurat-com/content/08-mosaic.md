> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 08 — Mosaic (selected screens)

EXTRACTED from `source/rendered.html:3037-3104` — `<section class="sv-mosaic-track" aria-label="Selected screens">`. This is the second scroll-pinned scene both prior passes flagged (`notes-runtime.md` §8: `section.sv-mosaic-track`, scrollHeight 2880px; pairs with `sv-card-in`/`sv-sheet-fade`/`sv-art-in` keyframes per `notes-bundles.md`).

## Structure

The entire mosaic is one giant `<a href="/work" aria-label="Explore all work">` wrapping a horizontally-scrubbed grid of 20 `<figure class="tile">` image tiles (`--cols: 5` at capture). No heading/body copy in this section — it's purely visual, image-only, functioning as a single big CTA link to `/work`.

## Tiles (DOM order), mapped to downloaded assets

| # | Alt text (verbatim) | Local asset |
|---|---|---|
| 1 | ProFolio 3 | `assets/images/sanity-210533e0-2880x2160_w1200.avif` |
| 2 | Otee 1 | `assets/images/sanity-4155bb3d-2880x2160_w1200.avif` |
| 3 | 4 | `assets/images/sanity-bfc67236-2880x2160_w1200.avif` |
| 4 | 3 | `assets/images/sanity-639542a2-2880x2160_w1200.avif` |
| 5 | ProFolio | `assets/images/sanity-4fae8a64-2880x2160_w1200.avif` |
| 6 | MindPath — app dashboard | `assets/images/sanity-e8d3e8e8-2880x2160_w1200.avif` |
| 7 | MindPath — patient view | `assets/images/sanity-2838d08b-2880x2160_w1200.avif` |
| 8 (`is-lead`, largest tile, has `srcset`) | Selected work | `assets/images/sanity-43c20612-2880x2160_w2400.avif` |
| 9 | Otee — order flow | `assets/images/sanity-0f0defcf-2880x2160_w1200.avif` |
| 10 | Landing — pricing | `assets/images/sanity-603804ec-2880x2160_w1200.avif` |
| 11 | Landing — long-form | `assets/images/sanity-c4dbd75a-2880x2160_w1200.avif` |
| 12 | Website — sections | `assets/images/sanity-38ac069e-2300x1725_w1200.avif` |
| 13 | Website — layout | `assets/images/sanity-492514a0-2880x2160_w1200.avif` |
| 14 | Retail analytics — dashboard overview | `assets/images/sanity-1eadd895-3840x2880_w1200.avif` |
| 15 | Codex — choose an organisation | `assets/images/sanity-a3ed14e8-3840x2880_w1200.avif` |
| 16 | Codex — create environment | `assets/images/sanity-e2837b19-3840x2880_w1200.avif` |
| 17 | Codex — import jobs | `assets/images/sanity-9f454c8f-3840x2880_w1200.avif` |
| 18 | Codex — entry editor | `assets/images/sanity-e452cdd4-3840x2880_w1200.avif` |
| 19 | Practice Lab — mental health programmes | `assets/images/sanity-2227c498-2880x2160_w1200.avif` |
| 20 | Codex — all entries & labels | `assets/images/sanity-c00dddf0-3840x2880_w1200.avif` |

All 20 are `loading="eager"` (not lazy) — consistent with this being an above/near-the-fold horizontally-pinned scroll scene where every tile needs to be ready before the user scrubs through it.

## Assets used in this section

All 20 Sanity CDN images listed above — see `assets/ASSETS.md` for full URL/license table (all REFERENCE-ONLY: Pleurat Shala's own project photography, not license-cleared for reuse elsewhere).
