# pleurat.com — Runtime / Live-Browser Teardown Notes

Captured with Playwright (Chromium 1.62.1, headless) on 2026-09-03. Logged-out, read-only visit — one page load, one scroll pass, one theme toggle + reload. No auth, no interaction beyond scrolling and a localStorage flag.

## 1. Hydration confirmation

- Initial `document.body.innerText.length` after `networkidle` + 4s settle: **3647 chars** (well over the 500-char bar). React SPA fully hydrated — real copy, not just `<div id="root">`.
- Full rendered DOM saved to `source/rendered.html` (177,947 bytes).

## 2. Network capture

- `source/network-log.json` — 57 responses captured (nav load only, scroll didn't trigger new requests — all images pre-fetched on load).
- Breakdown by content-type: 1 html, 5 css, 16 javascript, 2 woff2 fonts, 6 webp, 3 svg, **21 avif**, 1 json, 2 text/plain.
- Fonts: **General Sans** via `cdn.fontshare.com` (2 woff2 files — likely two weights).
- Images: tool-logo webp/svg icons served from `pleurat.com/assets/logos/` (supabase, cursor, claude, figma, github, openai, tailwind, vercel, grok) + one `assets/shots/web/web-08.avif`; the bulk of imagery (21 files) is served from **Sanity CMS** (`cdn.sanity.io/images/uh01905c/production/...`) at `2880x2160`/`3840x2880` source res, requested via Sanity's image-transform API (`?w=1200&q=80&auto=format` etc.) — confirms a headless Sanity CMS backing the content.
- No `<video>` or video network responses found.

## 3. Runtime probes (verbatim)

- `window.gsap?.version || window.gsapVersions` → **null** (no GSAP on window; either not used, or bundled/scoped so it never attaches globally).
- `window.ScrollTrigger?.getAll()...` → **null** (same — no global ScrollTrigger).
- `document.documentElement.classList.contains('lenis'/'lenis-smooth')` → **false**. `htmlClassList` at load → `[]` (empty; theme class only appears in light mode, see below).
- `window` keys matching `/gsap|scroll|lenis|barba|locomotive/i` → only native `scrollX/scrollY/scroll/scrollBy/scrollTo/onscroll*` — **no animation library attached to `window`**. Conclusion: animation is driven by CSS `@keyframes`/transitions (matches `document.getAnimations()` below) plus likely React state/IntersectionObserver-driven scroll logic that never leaks a library ref onto `window`. Could still be GSAP/Framer Motion bundled privately inside the JS chunks — the JS-bundle half of this teardown should check for `gsap`/`framer-motion` imports in the bundled source to confirm.
- `document.getAnimations()` → **63 running Web Animations** at capture time (full list in `source/runtime-probes.json`). Notable groups:
  - `CSSTransition` ×4 — 600ms, `cubic-bezier(0.2, 0.8, 0.2, 1)` (a generic UI-transition easing used repeatedly).
  - `sv-walk-bob`, `sv-walk-thigh`, `sv-walk-knee`, `sv-walk-foot`, `sv-walk-rise`, `sv-walk-carry`, `sv-walk-shoulder` — 840ms linear — a **CSS-keyframe walk-cycle** (likely an animated character/illustration built from SVG parts, not canvas since no `<canvas>` exists).
  - `sv-b-wire`, `sv-b-node`, `sv-b-lbl`, `sv-b-stick`, `sv-b-type`, `sv-b-line`, `sv-b-path` — 5000ms linear, many instances — looks like a **looping "build a diagram" animation** (wireframe/node/label/line draw-on sequence), probably in the chart or mosaic section.
  - `sv-drop`, `sv-tap` — 3600ms linear (×4/×1).
  - `sv-core`, `sv-step-hip`, `sv-step-knee`, `sv-step-arm` — 1600ms/500ms linear — another stepping/walking loop.
  - `sv-street-say` — 500ms linear (×2), `sv-card-in` 450ms, `sv-sheet-fade` 220ms ×6, `sv-art-in` 660ms.
  - All non-`CSSTransition` animations use **linear** easing at the Web Animations level, meaning any perceived easing comes from keyframe percentage spacing, not the timing function — consistent with hand-authored multi-step CSS keyframes rather than a JS tweening engine.
- `localStorage.getItem('theme-pref')` → **null** initially (key doesn't exist by default). Real key the site uses is **`sv-theme`** (found via `Object.keys(localStorage)` → `ph_phc_..._posthog`, `sv-palette`, `sv-theme`). Setting `theme-pref` to `'light'` and reloading nonetheless **did** flip the site to light mode (see below) — so the app must read `theme-pref` too (possibly as an override/fallback key), or the flip was coincidental with `prefers-color-scheme`/other stored state. Treat this as worth double-checking against the JS bundle for the real theme-key logic.
- PostHog analytics confirmed via localStorage key `ph_phc_BQsyp9X4PjYveL3GaRx82rL4GJ3MnY4xW94zoAFxB6F3_posthog`.

## 4. Theme toggle (dark default → light)

- Setting `localStorage['theme-pref']='light'` + reload **worked**: `document.documentElement.classList` became `['mode-light']`, `body` background went from `rgb(5,7,17)` (near-black navy) to `rgb(247,247,247)` (off-white), text color from `rgb(239,237,226)` (cream) to `rgb(15,21,36)` (near-black navy).
- Screenshot: `screenshots/desktop-full-light.png`.

## 5. Computed-style samples

**Dark (default) theme:**
| el | color | background | font | size | weight | line-height | letter-spacing |
|---|---|---|---|---|---|---|---|
| body | rgb(239,237,226) | rgb(5,7,17) | "General Sans", system-ui | 18px | 400 | 27px | normal |
| header/nav | rgb(22,20,14) | transparent | "General Sans","Helvetica Neue" | 17px | 400 | 26.35px | normal |
| footer | rgb(22,20,14) | rgb(255,253,243) | same | 17px | 400 | 26.35px | normal |
| h1 | rgb(22,20,14) | transparent | same | 58.32px | 500 | 60.65px | -1.75px |
| h2 | rgb(22,20,14) | transparent | same | 43.92px | 500 | 45.68px | -1.32px |
| h3 | rgb(22,20,14) | transparent | same | 29.52px | 500 | 45.76px | -0.74px |
| a / button | rgb(22,20,14) | transparent | same | 17px | 400 | 26.35px | normal |

Note: `body` itself carries the cream-on-navy dark palette, but header/h1-h3/footer computed values return a **dark ink color** (`rgb(22,20,14)`) regardless of theme — those elements likely sit inside light-background cards/panels (footer bg is literally `rgb(255,253,243)`, cream) even while the page background is dark navy. `main` returned `null` — no literal `<main>` element in the DOM.

**Light theme:** identical header/h1-h3/footer/a/button values (those panels don't change), but `body` flips to color `rgb(15,21,36)` on background `rgb(247,247,247)`. Full breakdown in `source/runtime-probes.json` → `lightThemeResult.computedLight`.

Font stack confirmed: **"General Sans"** (self/CDN-hosted via Fontshare woff2) with `Helvetica Neue, Helvetica, Arial, sans-serif` fallback on chrome elements, and `system-ui, -apple-system, sans-serif` fallback on body.

## 6. Data-attribute inventory

Only 4 distinct `data-*` attributes used anywhere in the DOM:
- `data-badge`
- `data-sdkn`
- `data-sdkv`
- `data-theme`

(`data-sdkn`/`data-sdkv` look like an SDK-name/SDK-version pair, possibly from an embedded widget/analytics snippet rather than app-authored markup.)

## 7. Canvas inventory

**None.** `document.querySelectorAll('canvas')` returned an empty array — despite the walk-cycle/diagram-build animation names suggesting something canvas-like, everything on this page is DOM/SVG + CSS-keyframe driven, not `<canvas>`/WebGL.

## 8. Sticky / scroll-scene sections

Heuristic scan (elements with `scrollHeight > 1.5×viewport` containing a `position: sticky|fixed` descendant) found, after filtering out whole-page wrapper false-positives (`#root`, `#scale-root`, `.site-root` — all just tall because they contain the whole page):

- **`section.sv-chart-sec` / `div.sv-chart-track`** — scrollHeight 2385px, starts at pageY ≈2090px. A pinned "chart" scene — almost certainly where the `sv-b-wire/-node/-lbl/-line/-path` build-on-diagram animations live, scrubbed by scroll position.
- **`section.sv-mosaic-track`** — scrollHeight 2880px, starts at pageY ≈5959px. A pinned "mosaic" scene, likely an image/card grid that assembles or reveals as you scroll (pairs with `sv-card-in`, `sv-sheet-fade`, `sv-art-in` animation names).

Screenshots at 25/50/75% internal-scroll progress for each candidate region (including the 3 false-positive whole-page entries, kept for completeness) are in `screenshots/`: `scene1-*` through `scene6-*` (`scene4`/`scene5` = the chart section, `scene6` = the mosaic section, based on scroll-position ordering; `scene1-3` = the whole-page false positives, safe to ignore/delete). Total page scroll height: **9498px** at 1440×900 viewport (≈10.5 viewport-heights — a long single-page scroll site).

## 9. Layout manifest

`source/layout-manifest.json` (382KB) — one meta entry `{viewportW:1440, viewportH:900, totalScrollHeight:9498}` plus per-element `{sel, scrollY, label, rect, position, zIndex, transform, opacity, fontFamily, fontSize, fontWeight, letterSpacing}` snapshots at: `top` (scrollY 0), 11 evenly-spaced scroll steps (~9%–100% of scrollable range, labelled `scroll-Npct`), and `bottom`. Covers header/nav/main/footer/section/canvas/h1-h3/sticky/fixed/img/video selectors at each state.

## 10. Screenshots

- `screenshots/desktop-full.png` — full-page, 1440px wide, dark (default) theme.
- `screenshots/mobile-full.png` — full-page, 390px wide, dark theme (scrolled through first to trigger lazy-loads).
- `screenshots/desktop-full-light.png` — full-page, 1440px wide, light theme (after `sv-theme`/`theme-pref` flip + reload).
- `screenshots/scene4-{25,50,75}pct.png`, `scene5-{25,50,75}pct.png` — chart/build-diagram section at 25/50/75% internal progress.
- `screenshots/scene6-{25,50,75}pct.png` — mosaic section at 25/50/75% internal progress.
- `screenshots/scene1-3-*pct.png` — whole-page false-positive captures (ignorable).

## Blockers / caveats

- Playwright was **not pre-installed** — had to `npx playwright install chromium` (full Chromium, not just headless-shell) and `npm install playwright` into the scratchpad to script it via Node, since no `playwright-skill` or MCP browser tool was available in this environment. Both installs succeeded; no blocker in the end.
- No GSAP/ScrollTrigger/Lenis found on `window` — either the site uses none of them (pure CSS keyframes, which the animation-name evidence supports) or they're privately scoped inside a bundle and never attach globally. **Recommend the JS-bundle half of this teardown grep the beautified bundle for `gsap`, `ScrollTrigger`, `framer-motion`, and `lenis` imports** to settle this definitively — the runtime probe alone can only prove absence-from-`window`, not absence-from-bundle.
- The `theme-pref` vs `sv-theme` localStorage-key discrepancy (see §3) should also be cross-checked against the bundled JS for the actual theme-persistence logic.
