# Teardown: pleurat.com — 2026-09-03

Fetched: 2026-09-03 | robots.txt: saved (`source/robots.txt`)
Bundle URLs (11 linked from `index.html`, +4 extra fetched for the theme investigation):
`index-DwCqBxFL.js`, `react-dom-36navsnf.js`, `router-5ag9yOgs.js`, `index-sXIK4by5.css`, `SiteHome-T3GVTo95.js`, `theme-CvJK8SGN.js`, `Commuter-BHE77-Jm.js`, `Ledger-DHCOg5iE.js`, `asset-BaG-jDRI.js`, `Console-CyBRxdTz.js`, `theme-DOAwoE7X.css`, + `UIKit-D8rdnxEG.js`, `UIKit-CqVRk1m9.css`, `index-D8zjrZIf.js`, `index-Di0mkZEe.css` (the private `/ui` and `/editor` tools, robots.txt-disallowed, fetched only to resolve the dark/light theme-key question)

Run split across 3 parallel agents: bundle download+beautify+static analysis, Playwright live pass, asset download+content extraction. Full findings: `notes-bundles.md`, `notes-runtime.md`, synthesized into `build-analysis.md`.

## Run self-check

- [x] Platform fingerprint: React 18.3.1 + Vite SPA, Sanity headless CMS (evidence cited in build-analysis.md)
- [x] Sections on page: 9 / documented in content/: 9 (`01-nav` … `09-footer`) — real DOM order differs from the initially guessed structure; corrected in build-analysis.md's rebuild order
- [x] Assets discovered: 34 / downloaded: 34 / skipped (capped): 0 — all in `assets/ASSETS.md`, including the one "Meta" logo slot that has no file (CSS-drawn, not an asset)
- [x] Library claims with cited evidence: no-animation-library claim confirmed 2 independent ways (static grep of all 13 beautified JS files: zero hits for gsap/ScrollTrigger/lenis/locomotive/barba/swup/THREE/SplitText/framer-motion; live `window.gsap`/`ScrollTrigger` both null, all 63 running WAAPI animations are CSS keyframes/transitions)
- [x] Playwright pass ran: yes — hydration confirmed (3647 chars body text), network capture (57 responses), full runtime probes, both themes
- [x] Screenshots captured: desktop (1440w) + mobile (390w) + desktop light theme + 6 scroll-scene sequences at 25/50/75% (18 images) = 21 screenshots total
- [x] Bundles beautified + every effect-driving custom component read: 10 custom components documented in build-analysis.md with exact constants/math and file:line citations (momentum scroll, stagger reveal, IO line-reveal, curtain+boot loader, board-walk marquee, walk-cycle keyframes, 2 pinned scroll-scenes, scroll-pin primitive, Console terminal widget, Commuter SVG rig)
- [x] data-* attribute inventory done: only 4 site-wide (`data-badge`, `data-sdkn`, `data-sdkv`, `data-theme`); canvas inventory: 0 canvases, confirmed everything is DOM/SVG+CSS
- [x] Sticky/tall sections captured at 25/50/75% scroll progress: 2 real scenes (`sv-chart-sec`, `sv-mosaic-track`) + 3 whole-page false-positives kept for completeness and flagged as ignorable
- [x] layout-manifest.json written: full element/style snapshots at top + 11 scroll steps + bottom (382KB); derived anchors and geometry cited in build-analysis.md
- [x] Spot-check: 3 palette hexes (`--sv-page #FFFCF0`, `--bg #050711`, `--sv-amber #F3B44A`) and General Sans heading font verified against both static CSS and live computed styles: **pass**

## Known issues found on the live site (not teardown errors)

- `theme-pref` (read by the FOUC script) vs `sv-theme` (the real toggle) localStorage-key mismatch → dark flash-of-wrong-theme for returning light-mode visitors. Confirmed via static grep (zero writes to `theme-pref` anywhere) + live probe (`Object.keys(localStorage)` only ever contains `sv-theme`).
- Stats/"by the numbers" section still shows placeholder `0+` digits (likely an un-fired or broken count-up animation).
- Hero's company-name list doesn't match the Teams card grid's names for the same 3 slots.
- Footer sitemap is missing a `/contact` link that nav has.
- Two live typos ("Industries workd", "Lets get in touch!") reproduced verbatim in `content/`.

## File map

| Local path | Original URL |
|---|---|
| `source/index.html` | `https://www.pleurat.com/` (head/shell) |
| `source/robots.txt` | `https://www.pleurat.com/robots.txt` |
| `source/rendered.html` | hydrated DOM, Playwright capture |
| `source/network-log.json` | 57 captured network responses |
| `source/layout-manifest.json` | geometry/style snapshots, 13 scroll states |
| `source/js/*.js` (+`.beautified.js`) | `/assets/*.js` — see `notes-bundles.md` for the full per-file mapping and what each chunk turned out to be |
| `source/css/*.css` (+`.beautified.css`) | `/assets/*.css` |
| `assets/images/`, `assets/svg/`, `assets/fonts/` | see `assets/ASSETS.md` for the full filename↔URL↔license table |
| `content/01-nav.md` … `09-footer.md` | homepage copy, section by section, REFERENCE-ONLY |
| `screenshots/*.png` | desktop/mobile/light + 6 scroll-scene 25/50/75% sequences |

## Notes

- No bot-challenge or CDN block encountered on any fetch (bundle agent: 15 files; asset agent: 34 files) — all verified real content, not challenge pages.
- Out of scope for this run (homepage only): 8 additional route chunks exist (`SiteAbout`, `SiteWork`, `SiteCase`, `SiteContact`, `SitePrivacy`, `SiteAi`, `SiteNotFound`, `Daughter`) — not fetched, not analyzed. A teardown of `/work`, `/case/*`, or `/ai` would need its own pass.

## Rebuild

A working local clone lives in `rebuild/` (zero-build static: `index.html` + `css/style.css` + one JS module per ported animation engine, no framework/build step). Full gate-by-gate scorecard and honesty audit: `rebuild/VERIFICATION.md`. Summary: Gates 1-6 PASS (30/30 tracked geometry checks, exact typography/token matches, 0 console errors across a full scroll-through + interaction pass); Gate 7 lists every placeholder value, simplified/reconstructed engine, and deliberate deviation (notably: the `theme-pref`/`sv-theme` FOUC bug is fixed rather than reproduced, and the `.site-root` default theme was corrected mid-build from an initial wrong dark-default assumption to match the teardown's own screenshots).
