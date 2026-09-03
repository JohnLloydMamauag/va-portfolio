# Build Analysis: Pleurat Shala — pleurat.com

**URL:** https://www.pleurat.com/  |  **Analyzed:** 2026-09-03  |  **Built by:** Pleurat Shala (self-built, per site copy — product designer / AI product builder)
**Platform:** React 18.3.1 + Vite SPA, client-side routed, content from a headless Sanity CMS — evidence: `react-dom-36navsnf.js.beautified.js:6887` (`version: "18.3.1"`); `/assets/index-{hash}.js` + `<link rel="modulepreload">` pattern in `source/index.html`; 20 distinct image URLs to `cdn.sanity.io/images/uh01905c/production/...` in `source/network-log.json` (21 total `avif` responses in the log — the 21st is `assets/shots/web/web-08.avif`, first-party not Sanity) [EXTRACTED]

## Tech Stack

| Technology | Version | Evidence | Tag |
|---|---|---|---|
| React / ReactDOM | 18.3.1 | `react-dom-36navsnf.js.beautified.js:6887,9,594` | EXTRACTED |
| Vite | build tool | `__vite__mapDeps`, modulepreload feature-detect, `/assets/index-{hash}.js` naming | EXTRACTED |
| react-router | version undetermined | shape of `L`/`de()` route hooks in `router-5ag9yOgs.js`; no literal string survived minification | INFERRED |
| Sanity CMS (headless) | — | 21 image URLs at `cdn.sanity.io/images/uh01905c/production/...?w=...&q=80&auto=format` in network log | EXTRACTED |
| PostHog | — | `source/index.html:110-120`, project key `phc_BQsyp9X4PjYveL3GaRx82rL4GJ3MnY4xW94zoAFxB6F3` | EXTRACTED |
| Google Analytics 4 | — | `source/index.html:97-99`, `G-3NT5LFZ30V` | EXTRACTED |
| **No animation library** (GSAP / Lenis / Locomotive / Barba / Swup / three.js / SplitText / Framer Motion) | — | Grepped all 13 beautified JS files: zero hits. `window.gsap`/`ScrollTrigger` both `null` at runtime. All 63 running `document.getAnimations()` are CSS `@keyframes`/transitions with **linear** WAAPI easing (the perceived easing lives in keyframe percentage spacing, not a timing function) | EXTRACTED (absence), confirmed two independent ways |
| Private internal tools | — | `/ui` (component-library showcase, `UIKit-*` chunk) and `/editor` (live CSS-token override tool) — both `Disallow`'d in `robots.txt`, reachable only by direct URL | EXTRACTED |

## Fonts

| Family | Weights | Source | License | Rebuild with |
|---|---|---|---|---|
| General Sans | 400, 500, 600, 700 | Fontshare CDN, preload-swap pattern (`source/index.html:89-90`) | Fontshare (Indian Type Foundry) — free commercial use | Same (Fontshare CDN link) |
| IBM Plex Mono | 400, 500 | Google Fonts (`source/index.html:96-97`) | SIL OFL | Same (Google Fonts link) — actual on-page usage unconfirmed from CSS alone (INFERRED it's used somewhere; grep for `--sv-code` consumers if precision matters) |

No self-hosted `@font-face` rules exist anywhere — both faces load exclusively via external CDN `<link>` tags. Both resolve to `"General Sans", "Helvetica Neue", Helvetica, Arial, sans-serif` as the effective on-page stack (`theme-DOAwoE7X.css:19-20`).

## Color Palette

Two **independent** token systems exist — a real, citable code-level split, not a design choice to preserve blindly in a rebuild:

### System 1 — public page content: `.site-root` / `.site-root.is-dark` (amber/paper), `theme-DOAwoE7X.css:1-100`
Toggled via `Ke()` hook (`theme-CvJK8SGN.js:1426-1439`), reads/writes `localStorage["sv-theme"]`.

| Token | Light (default) | Dark (`.is-dark`) |
|---|---|---|
| `--sv-page` | `#FFFCF0` | `#13120D` |
| `--sv-paper` | `#FBF7E6` | `#17160E` |
| `--sv-paper-2` | `#F3EDD6` | `#1F1C11` |
| `--sv-tile` | `#EFE9D2` | `#221F13` |
| `--sv-ink` | `#16140E` | `#F1EEE6` |
| `--sv-ink-2` | `#57534A` | `#A4A097` |
| `--sv-ink-3` | `#8B8577` | `#928C7E` |
| `--sv-amber` (accent) | `#F3B44A` | `#F3B44A` |
| `--sv-amber-2` | `#C77E0A` | `#DD922F` |
| `--sv-amber-lt` | `#F9CB80` | `#F9CB80` |
| `--sv-line` | `rgba(22,20,14,.16)` | `rgba(241,238,230,.24)` |

Plus a hidden dev/easter-egg "Millimeter" variant (`.pal-mm`, feature-flagged, `localStorage["sv-palette"]`) that re-skins only the SVG street/PCB illustrations.

### System 2 — global chrome / private tools: `:root` / `[data-theme=dark]` (lime/mint), `index-sXIK4by5.css:30-58`
This is the one the inline FOUC-prevention script in `source/index.html:14-18` actually controls, via `<html data-theme>`/`.mode-light`.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#c2ffa8` | `#050711` |
| `--lime` (accent) | `#C0EB3A` | `#C0EB3A` |
| `--lime-deep` | `#1A2200` | `#10160a` |
| `--ink` | `#0F1524` | `#EFEDE2` |
| `--ink-2` | `#383c48` | `#B7B5AA` |
| `--line` | `rgba(15,21,36,.1)` | `rgba(239,237,226,.13)` |

**Confirmed bug, cited two independent ways:** the FOUC script reads `localStorage['theme-pref']`, but grepping every downloaded JS bundle for `theme-pref` returns **zero writes** anywhere — nothing in the app ever sets that key. The real, user-facing toggle only ever writes `sv-theme` (confirmed live: `Object.keys(localStorage)` after using the site returns `sv-theme`, never `theme-pref`). Net effect: a visitor who switches to light mode gets `sv-theme=light` saved, `.site-root` correctly paints light on the next visit — but the FOUC script still finds no `theme-pref` key, defaults to dark, and paints `html,body{background:#050711}` (near-black) for one frame before React hydrates and the light `.site-root` covers it. **A real dark flash-of-wrong-theme bug for returning light-mode users**, not a rebuild artifact to reproduce faithfully — flag it if the site owner wants it fixed; a rebuild has no obligation to copy it.

## Typography and Spacing

Fluid, `clamp()`-based, three tiers (≤900px / 901–1600px / ≥1601px):

- Global (`index-sXIK4by5.css:71-89`): `--fs-h1: clamp(36px,3.5vw,54px)` · `--fs-display: clamp(42px,4.1vw,64px)` · `--fs-display-lg: clamp(52px,5.4vw,84px)` · `--fs-ghost: clamp(180px,28vw,420px)` (giant background numerals/type)
- Public site (`theme-DOAwoE7X.css:22-30`): `--sv-fs-display: clamp(37px,4.05vw,64px)` · `--sv-fs-h2: clamp(31px,3.05vw,47px)` · `--sv-fs-h3: clamp(38px,3.6vw,56px)` · `--sv-fs-body: 17px`
- Layout: `--sv-max: min(1524px,88vw)` · `--sv-gutter: 44px` (28px ≤1536px, 22px ≤1180px, 13px ≤960px) · `--sv-nav-h: 62px` (56px ≤960px) · `--sv-sp: clamp(96px,12vh,152px)` (section rhythm)
- Breakpoints in use (33 media queries): 520, 640, 680, 700, 720, 760, 860, 900/901, 960/961, 1040, 1180, 1536px

**Easing tokens** (exact, EXTRACTED):
- `--ease: cubic-bezier(.22,1,.36,1)` — global base
- `--ease-spring: cubic-bezier(.34,1.56,.64,1)` — overshoot
- `--sv-ease: cubic-bezier(.2,.8,.2,1)` — public-site reveal/mask (also confirmed live via WAAPI probe on 4 running `CSSTransition`s, 600ms)
- Curtain wipe: `cubic-bezier(.72,0,.22,1)`

Confirmed live: computed body — dark theme `color:rgb(239,237,226)` on `bg:rgb(5,7,17)`, `18px/27px`; h1 `58.32px/60.65px`, `letter-spacing:-1.75px`, weight 500. Note header/nav/h1-h3/footer all render a fixed dark ink `rgb(22,20,14)` regardless of theme — they sit on cream/paper panels, not the page background, so they don't flip with the body.

## Animation and Interaction Breakdown

All hand-rolled — **no external animation/scroll library anywhere in the bundle**. In page order:

### 1. Custom momentum scroll — [EXTRACTED] `ve()`, `theme-CvJK8SGN.js:53-120`
A hand-rolled Lenis-alike: spring-damped rAF loop, `target += (real - target)` isn't it — reverse: `r += (target-r)*0.115` per frame until `|target-r|<0.4`. `16px` per wheel "line" when `deltaMode===1`. In-page anchor scroll targets `rect.top+scrollY-navH-18`. Disabled for `(pointer:coarse)` and `prefers-reduced-motion:reduce` (native/smooth scroll fallback).
**Cloneable:** Yes — Low/Med complexity, ~70 lines, no dependency.

### 2. Scroll-linked stagger reveal — [EXTRACTED] `Fe()`/`i`, `theme-CvJK8SGN.js:235-304`
Not scroll-scrubbed by a library — custom `backOut` easing (`c1=1.7,c3=2.7`) computed per-child from scroll position:
```
C = 1/N
H = clamp((innerHeight*start - rect.top) / (innerHeight*span), 0, 1)
A = clamp((H - k*C) / (C*overlap), 0, 1)      // per item k
O = backOut(A)
opacity = clamp(A*1.6, 0, 1); transform = translateY((1-O)*rise) scale(from+(1-from)*O)
```
Used by Ledger (Teams grid: `from:.96,rise:12,start:.94,span:.36,overlap:.5`) and Console's tools grid (`from:.88,rise:18,start:.9,span:.5,overlap:.7`). rAF-driven, re-triggers on `MutationObserver`, respects reduced-motion/`document.hidden`.
**Cloneable:** Yes — Med complexity (the math must be ported exactly, "looks similar" stagger formulas will drift).

### 3. IntersectionObserver line/fade reveal — [EXTRACTED] `te()` + `ne`/`Ce`/`Be`, `theme-CvJK8SGN.js:127-152`
One-shot IO flag (threshold .16) toggles CSS classes; pure CSS does the rest:
```css
.sv-rv { opacity:0; transform:translateY(26px); transition:opacity .8s ease, transform .8s var(--sv-ease); }
.sv-lines .sv-ln>span { transform:translateY(140%); transition:transform .9s var(--sv-ease-mask); }
/* 80ms delay-ladder per line via :nth-child */
```
**Cloneable:** Yes — Low complexity.

### 4. Page-transition curtain + boot loader — [EXTRACTED] `kt()`, `index-DwCqBxFL.js:2419-2560`
8-column torn-paper wipe (`K=8`, `38ms` stagger/col, cream→paper gradient, amber `2px` bottom rule, `cubic-bezier(.72,0,.22,1)`), reversed delay order on reveal. Route-change timeline: arm → cover (746ms) → old content hidden at 260ms → route swap + `scrollTo(0,0)` at 746ms → hold 340ms → reveal (786ms+60ms). Reduced-motion skips straight to the swap. First-visit-only boot loader (`sessionStorage["sv-boot-seen"]`): progress bar timed to `Promise.race([document.fonts.ready, 1100ms])`, hard-capped 3000ms.
**Cloneable:** Partially — the choreography is fully specified above, but it's the highest-effort piece to port faithfully (route-change state machine + CSS coordination).

### 5. "Board-walk" chip marquee + walking robot — [EXTRACTED] `$e()`, `theme-CvJK8SGN.js:846-984`
Time-based (not scroll) infinite conveyor of PCB-chip SVGs + walking robot mascot, footer + `/work`/`/ai` hero backgrounds. `190px/sec`, `performance.now()` delta-time (capped 64ms), `p=(p+190*dt/1000)%loopLength`, ground-pad layer separately modulo'd for parallax. Click → "is-met" wave + "Hi 👋" bubble for 1700ms.
**Cloneable:** Yes — Med complexity.

### 6. Hand-keyed SVG walk cycle — [EXTRACTED] `theme-DOAwoE7X.css:2002-2186`, 87 `@keyframes` total site-wide
14-stop-per-limb bipedal walk (thigh/knee/foot `rotate()` at irregular %ages), companion bob/rise/carry/shoulder keyframes. Confirmed still running live (WAAPI probe, 840ms linear). This single site has 87 hand-authored `@keyframes` blocks driving pedestrian figures, a robot, LEDs, a cat tail, a TV, steam, a knock/porch/peek/open door sequence, a PCB wire/node/label draw-on, and a 404 stamp/leaf flow.
**Cloneable:** Partially — the mechanism (CSS keyframes on SVG parts) is trivial to clone; reproducing 87 specific hand-tuned curves is a large manual-authoring effort, not a code-porting one.

### 7. Two pinned scroll-scenes (confirmed live)
- `section.sv-chart-sec` (2385px tall, starts ~pageY 2090) — pinned "build a diagram" scene, ties to `sv-b-wire/node/lbl/line/path` keyframes (5000ms linear draw-on loop, confirmed running).
- `section.sv-mosaic-track` (2880px tall, starts ~pageY 5959) — pinned mosaic/card-assembly scene, ties to `sv-card-in`/`sv-sheet-fade`/`sv-art-in`.
Screenshotted at 25/50/75% internal progress in `screenshots/scene4-6-*pct.png`. No `<canvas>` anywhere on the page — everything is DOM/SVG, confirmed by an empty `document.querySelectorAll('canvas')`.
**Cloneable:** Partially — likely `Ve()` scroll-pin hook (see below) drives these; exact per-step content wasn't in the fetched chunks (see Gotchas).

### 8. Generic scroll-pin/steps primitive — [EXTRACTED, unconfirmed call site] `Ve()`/`b`, `theme-CvJK8SGN.js:188-218`
`container.height = calc(100vh + (steps-1)*95vh)`, `progress = clamp(-rect.top/(rect.height-innerHeight),0,1)` via rAF. The generic primitive a pinned scroll scene would use — no call site found in the 6 fetched route chunks; likely lives in an out-of-scope chunk (`SiteWork`/`SiteCase`, not fetched — see Gotchas). Probably what drives item 7 above.

### 9. "Console" — playable fake terminal — [EXTRACTED] `Console-CyBRxdTz.js:780-1159`
Self-contained mock IDE: job sidebar, 4 illustrated mock-UI scenes swapped per job, typed CLI log via `setTimeout` ladder (`130*(i+1)ms`/line), real mini command parser (`open/list/tags/next/clear/help`), plus a freehand pointer-draw "ink" annotation layer (SVG path from pointer events) doodleable over the terminal.
**Cloneable:** Partially — High complexity, bespoke interactive widget.

### 10. "Commuter" — rigged SVG pedestrian — [EXTRACTED] `Commuter-BHE77-Jm.js`, 472 lines
Fully hand-drawn cartoon figure (articulated legs/arm/face/coffee cup/bag), 3 posed variants: idle walker (animated by #6's keyframes), rock-paper-scissors throw, knocking (with sound-ring effect).
**Cloneable:** Hard — bespoke SVG illustration + rigging, not a code pattern to port.

## Rebuild Plan

### Recommended stack
`npm create vite@latest -- --template react` then `npm i react-router-dom`. No animation library needed — everything is plain CSS `@keyframes`/transitions + hand-rolled rAF/IntersectionObserver/MutationObserver hooks (items 1–3, 5, 8 above are all small, portable, dependency-free utilities — port them near-verbatim from the transcribed math, they're the load-bearing pieces). Wire up Sanity (or swap for local/static content — REFERENCE-ONLY imagery, see below) only if live CMS editing is actually needed; otherwise inline the extracted copy from `content/`.

### Section-by-section build order (mirrors `content/` numbering — corrected against the actual DOM, which differs from this doc's earlier guessed order)
1. Nav/header + custom momentum-scroll (#1) + page-transition curtain (#4) — cross-cutting, build first
2. Hero — headline/sub + line-reveal (#3); **Commuter's illustrated street-walk scene (#10) is embedded inside the hero**, not a separate section
3. Console — the interactive terminal/workspace demo, `id="contact"` / `class="sv-outro"` in the DOM despite the id name — **there is no actual contact form on the homepage**, don't build one expecting real content here
4. "Focus/Tracks" tab section — not identified by either static-analysis agent; present in the live DOM, see `content/04-focus-tracks.md` for its copy/structure before building it
5. Chart/"By the numbers" stats + pinned diagram scene (#7, #8) — copy was still `0+` placeholder digits at capture time (likely a count-up-on-scroll animation whose real target values weren't recovered); don't ship literal `0+` as final copy
6. AI-tools logo grid (part of #9's component, distinct from the interactive terminal) — note "Meta" has no logo asset, it's CSS-drawn (`aria-label="Meta logo"`)
7. Ledger — Teams card grid + stagger reveal (#2)
8. Mosaic pinned scene (#7) — 20 images, all mapped 1:1 to `assets/images/sanity-*.avif`
9. Footer — sitemap links + board-walk marquee (#5, only appears here, not duplicated elsewhere); live footer sitemap omits a `/contact` link that nav has (nav/footer link sets don't match — reproduce or fix per the rebuild owner's call)

**Content fidelity notes from the copy-extraction pass** (see `content/*.md` for full text, each prefixed REFERENCE-ONLY):
- Hero's company-name list (`aria-label`, reads "Sena/Valtech/Arnisa") does not match the Teams card grid's names (Appello/FourTwoThree/Otee) for the same 3 slots — a live-site inconsistency, not a teardown error.
- "Industries workd" and "Lets get in touch!" are typos present on the live site, reproduced verbatim in `content/`.
- JSON-LD `sameAs` (Awwwards/Dribbble/LinkedIn/ThemeForest) matches the footer's 4 external links exactly — no mismatch there.

### Assets: reuse vs. substitute
- **REUSE-OK**: General Sans (Fontshare, free commercial license) and IBM Plex Mono (Google Fonts, OFL) — load the exact same CDN links.
- **REFERENCE-ONLY**: every Sanity-served photo/illustration, the hand-drawn Commuter SVG character, the tool-logo brand marks (third-party trademarks — supabase/cursor/claude/figma/github/openai/tailwind/vercel/grok icons must not be reused outside a "these are the tools I use" context), og.png. Substitute with the rebuild owner's own imagery; see `assets/ASSETS.md` for the full per-file license table.

## Notes

- **Study-vs-deploy**: the layout system, spacing scale, easing curves, and all 10 animation mechanisms above are copyright-clean to reimplement (functional patterns, not expression). The actual copy, photography, and the hand-illustrated Commuter character are not — don't ship a rebuild with the original's imagery/copy as anything but local placeholder/reference.
- **Gotchas**: (1) no source maps exist anywhere, all JS analysis is from beautified-but-still-minified code — identifier names in this doc (`ve`, `Fe`, `Ke`, etc.) are the minified names, not the original source names; (2) 8 additional route chunks exist (`SiteAbout`, `SiteWork`, `SiteCase`, `SiteContact`, `SitePrivacy`, `SiteAi`, `SiteNotFound`, `Daughter`) that were out of scope for this teardown (homepage-only) — the `Ve()` scroll-pin hook's real call site and any `/work`/`/case-study` specific mechanics live there, not in what was analyzed; (3) the `theme-pref`/`sv-theme` dead-key mismatch above is a real bug in the source site, confirmed two independent ways — no reason to reproduce it.
- Private `/ui` and `/editor` tools were discovered (robots.txt-disallowed) but are internal dev tooling, not part of the public site surface — documented for completeness in `notes-bundles.md`, not part of the rebuild plan.
