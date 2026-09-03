> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 02 — Hero

EXTRACTED from `source/rendered.html:247-2354` (`<header class="sv-hero" id="top">`).

## Headline (mask-reveal `h1`, two lines via `sv-lines`/`sv-ln`)

> I design apps, websites,
> and **AI-powered systems** *(the bold span carries class `sv-dim`, a dimmed/secondary-color treatment, not bold weight)*

## Sub-copy

> 10+ years designing the systems, brands and AI workflows behind products people actually use, serving millions of users every day.

## CTAs (`div.sv-hero-cta`)

| Label | href | Style |
|---|---|---|
| View selected work | `/work` | `sv-btn sv-btn--amber` (primary, amber accent) + NE-pointing arrow icon (inline SVG) |
| About me | `/about` | `sv-btn sv-btn--ghost` (secondary/outline) + same arrow icon |

## Inline illustrated "street" scene (`div.sv-street`, `role="img"`)

Not a separate section — this hand-drawn SVG scene (buildings, lamp posts, walking figures) is embedded directly inside the hero, beneath the headline/CTA block. It's the same "Commuter" pedestrian-illustration system documented in `notes-bundles.md` (§7), reused here as a walk-past-your-past-clients visual.

- `aria-label` (full, EXTRACTED verbatim): *"A walk past 10 teams: Hoopit AI, Santander UK, Sena, Toyota, Gjirafa, ThemeForest, Nacew, Valtech, Arnisa, AI Journey. Click and the walker says hi."*
- Live readout at capture time (`div.sv-street-read`): index `05`, name **Gjirafa**, role **Lead Product Designer**, plus a small "Next projects" label — this is a rotating display cycling through the 10 companies as the walk animates (JS-driven; only one is visible/captured at a time in a static DOM snapshot).
- Purely decorative SVG geometry (buildings as `<rect>`s, sun/lamp gradients, parallax layers `.far`/`.far2`) — no further copy to extract; not a candidate for asset download since it's inline vector, not an image file.

## ⚠️ Content mismatch to flag

The hero's `aria-label` company list — **Hoopit AI, Santander UK, Sena, Toyota, Gjirafa, ThemeForest, Nacew, Valtech, Arnisa, AI Journey** — does **not** match the 10 "Teams" cards rendered later on the same page (`content/07-teams.md`, section `id="profile"`), which list **Hoopit AI, Santander UK, Appello, Toyota, Gjirafa, ThemeForest, Nacew, FourTwoThree, Otee, AI Journey**. Three names differ: Sena→Appello, Valtech→FourTwoThree, Arnisa→Otee. Both lists are otherwise identical and in the same order. This looks like a stale `aria-label` string (hand-written, not derived from the same CMS array as the cards) left over from an earlier client roster — worth flagging to the site owner if rebuilding, and definitely don't silently "fix" one to match the other without checking which is current.

## Cross-check against JSON-LD (`source/index.html:50-64`)

The `Person` schema's `description` — *"Product designer with 10+ years across SaaS, brand and design systems, building AI-native workflows"* — is consistent with the hero sub-copy above (both say "10+ years"). No mismatch here.

## Assets used in this section

None downloaded — all imagery in the hero is inline SVG (no raster/CDN images referenced).
