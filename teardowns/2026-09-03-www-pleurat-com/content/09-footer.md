> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 09 — Footer

EXTRACTED from `source/rendered.html:3105-3269` — `<footer class="sv-footer sv-ruled">`.

## Board-walk marquee (`div.sv-board-walk`)

The "board-walk" PCB-chip marquee + walking robot documented in `notes-bundles.md` §5 (`$e()` in `theme-CvJK8SGN.js`) lives here, in the footer — it is **not** present anywhere else on the homepage (no separate marquee/ticker section, contrary to the initial guessed structure).

- CTA button: **Explore portfolio →** — `href="/work"`
- Live readout (`div.sv-board-read`, captured state): index `05`, name **Vercel**, role **Daily kit**
- Scene `aria-label` (verbatim): *"A walk across the board: Claude, Figma, Cursor, Supabase, Vercel, OpenAI, Meta, Grok, GitHub, Tailwind"* — this is the **same 10-tool list** as `content/06-ai-tools.md`, in the same order, with no discrepancy (unlike the hero/teams company-name mismatch). The marquee loops the chip sequence 3× in the DOM for a seamless scroll (30 `<g class="chip">` groups total, 10 unique labels).

## Footer link columns (`div.sv-foot-grid`)

### Contact
- `<a href="mailto:hello@pleurat.com">hello@pleurat.com</a>`
- "Lets get in touch!" *(verbatim — missing apostrophe, "Let's"; EXTRACTED as-is, a live-site typo, not a transcription error on this pass)*
- "Response within 24 hours"

### Sitemap
| Label | href |
|---|---|
| Welcome | `/` |
| Work | `/work` |
| AI | `/ai` |
| Profile | `/about` |

Note: unlike the nav (`content/01-nav.md`), the footer sitemap list does **not** include a "Contact" link — contact is only reachable here via the mailto link above, not a `/contact` route link.

### Elsewhere
| Label | href |
|---|---|
| Awwwards | `https://www.awwwards.com/Pleurats/` |
| Dribbble | `https://dribbble.com/Pleurat` |
| LinkedIn | `https://www.linkedin.com/in/pleuratshala/` |
| ThemeForest | `https://themeforest.net/user/pleuratt` |

All external links open `target="_blank" rel="noopener noreferrer"`, each suffixed with the same NE-arrow icon used on hero/CTA buttons.

**Cross-check against JSON-LD** (`source/index.html:59-60`, `Person.sameAs`): the array `["awwwards.com/Pleurats/", "dribbble.com/Pleurat", "linkedin.com/in/pleuratshala/", "themeforest.net/user/pleuratt"]` matches these four footer links exactly, same order, same URLs. **No mismatch** — this is the one piece of structured data that's fully consistent with the visible page.

### Studio
- "Pristina · CET Europe"
- "Product design · Systems · AI"

## Legal line (`div.sv-legal`)

> © 2026 Pleurat Shala — All rights reserved

- `<a href="/privacy">Privacy</a>`

## Assets used in this section

None directly downloadable — the board-walk marquee reuses the same tool-name *labels* as `content/06-ai-tools.md` but renders them as inline SVG `<text>` chip labels on a hand-drawn PCB illustration, not as image/logo files (no `<img>` tags in this component at all — visually distinct from the AI-tools grid's actual logo images).
