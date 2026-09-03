> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 01 — Nav / Header

EXTRACTED from `source/rendered.html:172-246`.

## Structure

`<nav class="sv-nav">` fixed header, containing:

1. **Brand mark** — `<a class="sv-brand" aria-label="Pleurat Shala — home" href="/">` wrapping an inline SVG wordmark logo (`viewBox="0 0 240 71"`, reads "pleurat" in a custom lettering — no separate logo image file, it's hand-drawn `<path>` data, `currentColor` fill so it inherits ink/theme color).
2. **Primary links** (`div.sv-nav-links`):
   | Label | href | Notes |
   |---|---|---|
   | Welcome | `/` | has `aria-current="page"` (homepage) |
   | Work | `/work` | |
   | AI | `/ai` | |
   | Profile | `/about` | |
3. **Theme toggle** — `<button class="sv-lights" aria-pressed="false" aria-label="Switch to dark">` with a small dial/sun-half SVG icon. No visible label text, icon-only.
4. **Contact CTA** — `<a class="sv-btn sv-btn--amber sv-nav-cta" href="/contact">Contact</a>`
5. **Mobile menu toggle** — `<button class="sv-nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="sv-nav-menu">` (hamburger, 3 `<span>` bars, no text).

## Mobile nav sheet (`div#sv-nav-menu`, hidden by default)

Numbered link list (`nav.links`), each row shows an index prefix:

| Index | Label | href |
|---|---|---|
| 01 | Welcome | `/` (aria-current="page") |
| 02 | Work | `/work` |
| 03 | AI | `/ai` |
| 04 | Profile | `/about` |
| 05 | Contact | `/contact` |

Footer of the sheet (`div.sv-nav-foot`):
- `<a href="mailto:hello@pleurat.com">hello@pleurat.com</a>`
- `<span>Pristina · CET</span>`

## Assets used in this section

None from `assets/` — the brand mark is inline SVG path data (no external file), the theme-toggle and hamburger icons are inline SVG too.

## Notes

- No literal `<header>` tag wraps the nav — it's `<nav class="sv-nav">` directly under the root, confirmed by the runtime notes ("`main` returned `null` — no literal `<main>` element in the DOM" — same absence pattern for semantic landmarks generally on this site).
- Desktop link set (4 items, no "Contact" — it's a separate CTA button) differs slightly from the mobile sheet's 5-item list (which folds Contact in as item 05).
