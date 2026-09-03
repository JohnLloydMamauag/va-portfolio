# pleurat.com — bundle/static teardown notes

Scope: static HTML shell, downloaded JS/CSS bundles, beautified + grepped locally (no WebFetch used on any HTML/CSS/JS). Every claim tagged EXTRACTED (grep hit / line cited) or INFERRED (pattern-matched).

## Tech stack

| Technology | Version | Evidence | Tag |
|---|---|---|---|
| React | 18.3.1 | `react-dom-36navsnf.js.beautified.js:6887` — `version: "18.3.1"`; `:9` `@license React` / `react.production.min.js` banner | EXTRACTED |
| React DOM | 18.3.1 (same bundle) | same file, `:6926` `ze.createRoot = function(e,t){...}`, `:594` `react-dom.production.min.js` banner | EXTRACTED |
| Vite | build tool (version undetermined) | `index-DwCqBxFL.js.beautified.js:1` `const __vite__mapDeps=...`; `:24-29` `modulepreload` feature-detect + `vite:preloadError` event; filename pattern `/assets/index-{hash}.js` + `<link rel="modulepreload">` in `source/index.html` | EXTRACTED |
| react-router (react-router-dom) | version undetermined | `router-5ag9yOgs.js` chunk exports a `Link`-shaped component (`L`) and route hooks (`r`) consumed everywhere as `useNavigate`/`useLocation`-style calls (`de()` returns `{pathname}` in `theme-CvJK8SGN.js:1205`); no literal "react-router" string survived minification | INFERRED |
| TypeScript source | — | UIKit `/ui` page footer literally says "Components live in `src/ui/index.jsx`, their styling in `src/styles/ui.css`... shared interaction rules... in `src/styles/system.css`" (`UIKit-D8rdnxEG.js.beautified.js:657-663`); JSX not TSX per that string | EXTRACTED |
| PostHog analytics | — | `source/index.html:110-120`, `posthog.init("phc_BQsyp9X4PjYveL3GaRx82rL4GJ3MnY4xW94zoAFxB6F3", {api_host:"https://us.i.posthog.com", capture_pageview:true, autocapture:true, capture_dead_clicks:true, rageclick:true})` | EXTRACTED |
| Google Analytics 4 | — | `source/index.html:97-99`, `gtag('config','G-3NT5LFZ30V')` | EXTRACTED |
| Fontshare (General Sans) + Google Fonts (IBM Plex Mono) | — | `source/index.html:89`, `https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700`; `:96` `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500` | EXTRACTED |
| No animation library (GSAP/Lenis/Locomotive/Barba/Swup/Three/SplitText/Framer Motion) | — | `grep -ril` for `gsap`, `ScrollTrigger`, `lenis`, `locomotive`, `barba`, `swup`, `THREE.`/`WebGLRenderer`, `SplitText`/`SplitType`, `framer-motion` across all 13 beautified JS files → **zero hits**. All scroll/reveal/marquee/curtain effects are hand-rolled with `requestAnimationFrame`, `IntersectionObserver`, CSS `transition`/`@keyframes`, and `MutationObserver` | EXTRACTED (absence) |

No `//# sourceMappingURL=` comment was found at the end of any of the 13 downloaded JS files (checked with `tail -c 200` + grep) — no `.map` files exist to fetch; all JS analysis below is from beautified-minified code.

## robots.txt (EXTRACTED, `source/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /editor
# internal bench: the component library
Disallow: /ui

Sitemap: https://www.pleurat.com/sitemap.xml
```

`/editor` is a private live CSS-token editor tool; `/ui` is a private component-library/design-system showcase page. Both were pulled in as extra chunks (below) because they're referenced from `index-DwCqBxFL.js`'s route table, even though `index.html` doesn't link to them directly.

## Downloaded files (file-map)

All fetched with `curl -sL -A "Mozilla/5.0 ... Chrome/125.0.0.0 Safari/537.36"`, beautified with `npx js-beautify`.

| Local path | Original URL | Notes |
|---|---|---|
| `source/robots.txt` | `https://www.pleurat.com/robots.txt` | |
| `source/js/index-DwCqBxFL.js` (+`.beautified.js`) | `/assets/index-DwCqBxFL.js` | Main entry: `__vite__mapDeps`, App shell, route table, page-transition curtain, first-load boot loader |
| `source/js/react-dom-36navsnf.js` (+beautified) | `/assets/react-dom-36navsnf.js` | React 18.3.1 + ReactDOM, vendor chunk |
| `source/js/router-5ag9yOgs.js` (+beautified) | `/assets/router-5ag9yOgs.js` | Router vendor chunk |
| `source/css/index-sXIK4by5.css` (+beautified) | `/assets/index-sXIK4by5.css` | Global base stylesheet (render-blocking `<link rel="stylesheet">`), lime/mint token system, curtain CSS |
| `source/js/SiteHome-T3GVTo95.js` (+beautified) | `/assets/SiteHome-T3GVTo95.js` | Home route: hero, marquee/ticker, assembles Ledger/Console/Commuter sections |
| `source/js/theme-CvJK8SGN.js` (+beautified) | `/assets/theme-CvJK8SGN.js` | Shared UI kit: Nav, Footer, reveal hooks, custom momentum-scroll, logo SVG, "board-walk" chip marquee |
| `source/js/Commuter-BHE77-Jm.js` (+beautified) | `/assets/Commuter-BHE77-Jm.js` | Hand-illustrated pedestrian SVG character system (walk cycle, rock-paper-scissors gesture) |
| `source/js/Ledger-DHCOg5iE.js` (+beautified) | `/assets/Ledger-DHCOg5iE.js` | "Teams" card-grid section (`id="profile"`, `data-badge="Teams"`) |
| `source/js/asset-BaG-jDRI.js` (+beautified) | `/assets/asset-BaG-jDRI.js` | Tiny utility: normalizes asset URLs (prefixes `/`) |
| `source/js/Console-CyBRxdTz.js` (+beautified) | `/assets/Console-CyBRxdTz.js` | Interactive fake-terminal "AI workflow" demo widget + "AI tools" logo grid |
| `source/css/theme-DOAwoE7X.css` (+beautified) | `/assets/theme-DOAwoE7X.css` | Public-site design system: `.site-root`/`.site-root.is-dark` tokens, ~87 `@keyframes`, all page CSS |
| `source/js/UIKit-D8rdnxEG.js` (+beautified) | `/assets/UIKit-D8rdnxEG.js` | Extra fetch beyond assigned list — the `/ui` route (private component-library showcase, disallowed in robots.txt) |
| `source/css/UIKit-CqVRk1m9.css` (+beautified) | `/assets/UIKit-CqVRk1m9.css` | Extra fetch — styling for the `/ui` showcase |
| `source/js/index-D8zjrZIf.js` (+beautified) | `/assets/index-D8zjrZIf.js` | Extra fetch — the `/editor` route (private live CSS-token override tool, `localStorage["pleurat:editor:v2"]`) |
| `source/css/index-Di0mkZEe.css` (+beautified) | `/assets/index-Di0mkZEe.css` | Extra fetch — styling for `/editor` |

**Note on scope:** the task's file list matched exactly the 11 tags present in `source/index.html`. Grepping the beautified `index-DwCqBxFL.js`'s `__vite__mapDeps` array (line 1) revealed the *full* route-chunk graph includes many more lazily-loaded chunks not linked from `index.html` at all: `SiteAbout-59Cd-HJn.js`, `Daughter-HgqIGkFr.js`, `SiteWork-CLDoUXyQ.js`, `SiteCase-BNC6h7lD.js`, `SiteContact-BsBFIpEY.js`, `SitePrivacy-QJ-JRPC-.js`, `SiteAi-CZJgsaIq.js`, `SiteNotFound-BVA8K3wc.js`. I fetched **UIKit** and the **`/editor`** `index-*` chunk (4 extra files) specifically because they were needed to resolve the dark/light theme toggle question (task item 6) — that logic wasn't present in `theme-CvJK8SGN.js`/`theme-DOAwoE7X.css` alone. The remaining route chunks (About/Work/Case/Contact/Privacy/Ai/NotFound/Daughter) were **not** fetched — out of assigned scope, flagging here in case the live-browser half or a future pass wants them.

## Fonts

| Family | Weights | Source | License |
|---|---|---|---|
| General Sans | 400, 500, 600, 700 | Fontshare CDN (`api.fontshare.com`), loaded via preload-swap pattern, `source/index.html:89-90` | Fontshare (Indian Type Foundry) — free for commercial use per Fontshare's license (not verified from bundle, standard Fontshare terms) |
| IBM Plex Mono | 400, 500 | Google Fonts, `source/index.html:96-97` | SIL Open Font License (IBM Plex is OFL) |

No `@font-face` rules exist in any downloaded CSS (`grep @font-face` on all 6 beautified CSS files → zero hits) — both faces load exclusively via the external CDN `<link>` tags in the HTML head, not self-hosted. CSS variable `--sv-sans`/`--sv-mono` both actually resolve to `"General Sans", "Helvetica Neue", Helvetica, Arial, sans-serif` (`theme-DOAwoE7X.css.beautified.css:19-20`) — IBM Plex Mono is loaded but I did not find a `--sv-code`-consuming rule that isn't the generic `ui-monospace, SFMono-Regular, Menlo, monospace` fallback stack (`theme-DOAwoE7X.css.beautified.css:21`), so Plex Mono's actual on-page usage is unconfirmed from CSS alone — INFERRED it's used somewhere the live-render half can spot-check.

## Color palettes — there are TWO independent systems

### 1. Public site content — `.site-root` / `.site-root.is-dark` (theme-DOAwoE7X.css:1-100)

Controlled at runtime by `Ke()` hook in `theme-CvJK8SGN.js:1426-1439`, which reads/writes `localStorage["sv-theme"]` (`"dark"`/`"light"`) and toggles an `is-dark` class on the page's root `<div class="site-root">` — **not** on `<html>`.

| Token | Light (default) | Dark (`.is-dark`) |
|---|---|---|
| `--sv-page` | `#FFFCF0` | `#13120D` |
| `--sv-sheet` | `#FFFDF3` | `var(--sv-page)` |
| `--sv-paper` | `#FBF7E6` | `#17160E` |
| `--sv-paper-2` | `#F3EDD6` | `#1F1C11` |
| `--sv-tile` | `#EFE9D2` | `#221F13` |
| `--sv-ink` | `#16140E` | `#F1EEE6` |
| `--sv-ink-2` | `#57534A` | `#A4A097` |
| `--sv-ink-3` | `#8B8577` | `#928C7E` |
| `--sv-amber` (accent) | `#F3B44A` | `#F3B44A` (same) |
| `--sv-amber-2` | `#C77E0A` | `#DD922F` |
| `--sv-amber-lt` | `#F9CB80` | `#F9CB80` (same) |
| `--sv-line` | `rgba(22,20,14,.16)` | `rgba(241,238,230,.24)` |
| `--sv-line-2` | `rgba(22,20,14,.08)` | `rgba(241,238,230,.12)` |

Plus a second, hidden **"Millimeter" palette** (`.site-root.pal-mm`) — a purely visual variant applied to the SVG street-scene/PCB illustrations only (`theme-DOAwoE7X.css.beautified.css:13781+`, dozens of `.site-root.pal-mm:not(.is-dark) .sv-board-view .*`/`.sv-street-view .*` color overrides). It's gated behind a feature-flag function `q()` in `theme-CvJK8SGN.js:986` (`ce()` imported from the main bundle) and only surfaces a UI toggle when that flag is true — likely a dev/easter-egg mode, stored under `localStorage["sv-palette"]` (`theme-CvJK8SGN.js:985,991`).

### 2. Global base chrome / private tools — `:root` / `[data-theme=dark]` (index-sXIK4by5.css:30-58)

This is the render-blocking global stylesheet (loaded on every route incl. `/ui`, `/editor`) and is the one actually keyed by `<html data-theme="dark">` / `<html class="mode-light">` — the exact attribute the inline bootstrap script in `source/index.html:14-18` sets before React hydrates.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#c2ffa8` | `#050711` |
| `--lime` (accent) | `#C0EB3A` | `#C0EB3A` |
| `--lime-2` | `#E2F79A` | (unset, inherits) |
| `--lime-deep` | `#1A2200` | `#10160a` |
| `--ink` | `#0F1524` | `#EFEDE2` |
| `--ink-2` | `#383c48` | `#B7B5AA` |
| `--ink-3` | `#888a94` | `#7d7c72` |
| `--ink-4` | `#c0c1c8` | `#4a4a44` |
| `--line` | `rgba(15,21,36,.1)` | `rgba(239,237,226,.13)` |

**EXTRACTED discrepancy worth flagging:** the inline FOUC-prevention script (`source/index.html:14-18`) reads `localStorage.getItem('theme-pref')` and defaults to dark, setting `<html data-theme="dark">` or `<html class="mode-light">` accordingly — but `grep -r "theme-pref"` across every downloaded JS bundle (`index-DwCqBxFL.js`, `theme-CvJK8SGN.js`, `index-D8zjrZIf.js`, `UIKit-D8rdnxEG.js`, etc.) returns **zero writes** to that key anywhere. The only localStorage key actually read/written by the toggle logic (`Ke()`, `theme-CvJK8SGN.js:1426-1439`; call site `SiteHome-T3GVTo95.js:1622` `const [e,a] = Ss()`) is `"sv-theme"` — a different key, which only flips `.site-root.is-dark`, never `<html>`'s attribute/class. Net effect: the two color systems (global lime chrome vs. amber page content) are driven by two different, seemingly disconnected localStorage keys, so a returning visitor who previously switched to light mode would very likely still get the dark-background flash from the inline script (`html,body{background:#050711}` at `index.html:19`) before React mounts and paints the light `.site-root` over it. I can't confirm the resulting visual behavior without a live browser — that's for the Playwright half to verify — but the code-level mismatch is real and cited above.

## Typography scale, spacing, breakpoints (index-sXIK4by5.css + theme-DOAwoE7X.css)

Global type scale (`index-sXIK4by5.css.beautified.css:71-89`), fluid via `clamp()`, three responsive tiers (`≤900px`, `901–1600px` default, `≥1601px`):
`--fs-micro:9px` · `--fs-2xs:11px` · `--fs-xs:12.5px` · `--fs-sm:15px` · `--fs-md:17.5px` · `--fs-lg:20px` · `--fs-xl:24px` · `--fs-h1:clamp(36px,3.5vw,54px)` · `--fs-display:clamp(42px,4.1vw,64px)` · `--fs-display-lg:clamp(52px,5.4vw,84px)` · `--fs-ghost:clamp(180px,28vw,420px)`.

Public-site type scale (`theme-DOAwoE7X.css.beautified.css:22-30`): `--sv-fs-display:clamp(37px,4.05vw,64px)` · `--sv-fs-h2:clamp(31px,3.05vw,47px)` · `--sv-fs-h3:clamp(38px,3.6vw,56px)` · `--sv-fs-body:17px` · `--sv-fs-micro:10.5px`.

Layout: `--sv-max:min(1524px,88vw)` · `--sv-gutter:44px` (28px ≤1536px, 22px ≤1180px, 13px ≤960px) · `--sv-nav-h:62px` (56px ≤960px) · `--sv-sp:clamp(96px,12vh,152px)`.

Distinct breakpoints found across `theme-DOAwoE7X.css` (33 media-query occurrences): `520, 640, 680, 700, 720, 760, 860, 900/901, 960/961, 1040, 1180, 1536` px.

Easing curves (EXTRACTED, exact strings):
- `--ease: cubic-bezier(.22,1,.36,1)` (global base)
- `--ease-spring: cubic-bezier(.34,1.56,.64,1)` (global base — spring/overshoot)
- `--sv-ease: cubic-bezier(.2,.8,.2,1)` / `--sv-ease-mask: cubic-bezier(.2,.85,.2,1)` (public site — reveal/mask transitions)
- Curtain wipe: `cubic-bezier(.72,0,.22,1)` (`index-sXIK4by5.css.beautified.css:637,663`)
- Nav mobile-sheet links: `cubic-bezier(.22,1,.3,1)` (`theme-DOAwoE7X.css.beautified.css:12357`)
- ~15 more one-off `cubic-bezier(...)` curves scattered through component-specific `@keyframes`/`transition` rules (rock-paper-scissors `.4,0,.3,1`; jump `.32,1.2,.4,1`; clip-path reveal `.65,.05,.2,1`; height reveal `.22,.9,.24,1`; etc.) — see `theme-DOAwoE7X.css.beautified.css` grep hits for `cubic-bezier`.

## Keyframes

`grep -c "@keyframes" theme-DOAwoE7X.css.beautified.css` → **87 distinct `@keyframes` blocks**. This is an extensively hand-animated site: almost every one drives a piece of the illustrated SVG scenes (walking pedestrians, breathing/swaying figures, a robot, LEDs, a cat tail, a TV, steam, a caret, a swing, a lamp, knock/porch/peek/open door sequences, PCB board wires/nodes/labels, a 404 flow/stamp/leaf). Representative full transcriptions:

**`sv-walk-thigh` / `sv-walk-knee` / `sv-walk-foot`** (`theme-DOAwoE7X.css.beautified.css:2002-2186`) — a hand-keyed bipedal walk cycle, 14 keyframe stops per limb segment at irregular percentages (0/3/8/16/24/32/40/48/55/62/70/78/86/93/100%), each a `rotate(Ndeg)` value (e.g. thigh: `-25.4deg → -23.5deg → -25.8deg → -15.8deg → -5.4deg → -9.2deg → -10deg → -8.2deg → -4deg → -.9deg → -15deg → -25deg → -26.4deg → -25.9deg → -25.4deg`). Companion keyframes `sv-walk-shoulder` (simple 2-stop: `-21deg` at 0/100%, `8deg` at 50%), `sv-walk-bob`/`sv-walk-rise` (vertical bounce, `translateY(2px)`/`translateY(-.9px)` alternating every 25%), `sv-walk-carry` (arm-carry sway, `rotate(-2.4deg)`/`rotate(1.6deg)` alternating every 25%).

**`sv-rps`** (`theme-DOAwoE7X.css.beautified.css:13442-13474`) — the rock-paper-scissors arm throw wind-up: `rotate(0) → -16deg(8%) → 2deg(16%) → -16deg(24%) → 2deg(32%) → -18deg(40%) → 4deg(48%) → 4deg(100%)`, applied as `animation: sv-rps 3.6s cubic-bezier(.4,0,.3,1) infinite` (`theme-DOAwoE7X.css.beautified.css:1936`).

**`sv-jump`** — `animation: sv-jump .62s cubic-bezier(.32,1.2,.4,1)` (`theme-DOAwoE7X.css.beautified.css:2325`), an overshoot/bounce curve for the "board-walk" robot's jump.

**Board-walk marquee scroll** (JS-driven, not `@keyframes`) — see Custom Components below.

Other named keyframes present (not individually transcribed — grep line numbers cited for follow-up): `sv-wave, sv-board-hi, sv-core, sv-street-say, sv-hi, sv-cue, sv-art-in, sv-blink, sv-drop, sv-tap, sv-ring, sv-lift, sv-build, sv-tok, sv-sheet-fade, sv-rise, sv-sk, sv-pop, sv-pulse, sv-dk-breath(e), sv-dk-sway, sv-cat-tail, sv-tv, sv-steam, sv-glow, sv-caret, sv-sway, sv-type, sv-desk-bob, sv-desk-wave, sv-swing, sv-ball, sv-hop, sv-lamp(-breathe), sv-knock, sv-rap, sv-porch, sv-peek, sv-open, sv-card-in, sv-fig-wave, sv-b-wire/node/lbl/stick/type/line/add/path/step/dot/part, sv-bd-fill, sv-b-path-flow/sys/prod, sv-nda-roll/pop-in/pop-arm/live/think/caret, sv-rg-led/run/hand/work/think, sv-404-flow/stamp/leaf`.

## Custom components (hand-written, drive visible effects)

### 1. Custom momentum scroll — `ve()` in `theme-CvJK8SGN.js:53-120`
Replaces native scrolling with a spring-damped rAF loop on desktop pointer devices (disabled for `(pointer:coarse)` and `prefers-reduced-motion:reduce`, which fall back to native/`smooth` scroll). Exact constants (`:44-46`):
```
me = .115   // damping factor per frame: r += (target - r) * me
xe = 16     // px per "line" when a wheel event reports deltaMode===1
ue = .4     // px; loop stops once |target - current| < ue
```
Wheel handler (`:101-109`) intercepts vertical wheel input (ignoring ctrl-zoom and elements where `deltaX` dominates or an internal `.sv-cn-log`/`.sv-report-sheet .scroll` panel can scroll itself), accumulates a `target` scroll position clamped to `[0, scrollHeight-innerHeight]`, and drives it toward the real scrollTop via `r += (target-r)*.115` every frame until within 0.4px. In-page anchor clicks (`a[href^="#"]`) are intercepted the same way, target computed via `je()` (`:48-51`): `rect.top + scrollY - navH - 18`, where `navH` reads the live `--sv-nav-h` CSS var (fallback 62px). **What it does:** an ease-out inertial scroll (like a hand-rolled Lenis) with no external library.

### 2. Scroll-linked stagger reveal — `Fe()` in `theme-CvJK8SGN.js:235-304` (exported as `i`)
Used by `Ledger-DHCOg5iE.js` (Teams card grid, `:18-23`: `{from:.96, rise:12, start:.94, span:.36, overlap:.5}`) and `Console-CyBRxdTz.js`'s AI-tools grid (`:50-55`: `{from:.88, rise:18, start:.9, span:.5, overlap:.7}`). Default params (`:237-241`): `from:.9, rise:16, start:.78, span:.68, overlap:.85`.
Exact math (`:262-286`):
```js
clamp(p,C,y) = min(y, max(C,p))
backOut(p) { const y = p-1; return 1 + (1.7+1)*y**3 + 1.7*y**2 }   // c1=1.7, c3=2.7 easeOutBack variant
// per frame, for container rect y and N children:
C = 1 / N                                                          // share of scroll-range per item
H = clamp((innerHeight*start - rect.top) / (innerHeight*span), 0, 1)   // overall progress
// per item k:
A = clamp((H - k*C) / (C*overlap), 0, 1)
O = backOut(A)
opacity   = clamp(A*1.6, 0, 1)
transform = translateY((1-O)*rise) + scale(from + (1-from)*O)
```
Recomputed on scroll/resize via `requestAnimationFrame`, re-triggered on DOM mutation via a `MutationObserver` (so dynamically-loaded cards still animate in). Respects `prefers-reduced-motion` and `document.hidden` (both snap straight to final state). **What it does:** a scroll-position-driven (not time-based) staggered card entrance with overshoot easing — items overlap their reveal windows by `overlap` (0.5–0.85), producing a cascading pop-in.

### 3. In-view "line reveal" — `te()` hook (`:127-152`) + `ne`/`Ce`/`Be` wrapper components (`:1007-1116`)
`te(threshold=.16)` is an `IntersectionObserver`-backed one-shot "is in view" flag with a `requestAnimationFrame` + `260ms setTimeout` double-trigger fallback (`:138`) for elements already in view on mount. Feeds the `.sv-rv`/`.is-in` and `.sv-lines .sv-ln`/`.is-in` CSS classes. CSS transitions (`theme-DOAwoE7X.css.beautified.css:370-405`):
```css
.sv-rv { opacity:0; transform:translateY(26px); transition:opacity .8s ease, transform .8s var(--sv-ease); }
.sv-lines .sv-ln>span { transform:translateY(140%); transition:transform .9s var(--sv-ease-mask); }
.sv-lines .sv-ln:nth-child(2)>span { transition-delay:.08s }
.sv-lines .sv-ln:nth-child(3)>span { transition-delay:.16s }
```
**What it does:** classic mask-reveal headline lines (each line clips and slides up from 140% translateY, 0.9s, 80ms delay-ladder per line) plus a generic fade+rise-26px wrapper for body copy/CTAs — all pure CSS transitions gated by one IntersectionObserver flag, not JS-animated per frame.

### 4. Page-transition curtain + first-load boot loader — `kt()` in `index-DwCqBxFL.js.beautified.js:2419-2560`+
Constants (`:2426-2433`):
```js
K = 8            // curtain column count — matches CSS --n:8 (index-sXIK4by5.css.beautified.css:616)
me = 38          // ms stagger per column — matches CSS --stagger:38ms
ae = 480+(K-1)*38 = 746   // total cover duration (ms) — CSS default --cover is .48s=480ms, base of this formula
se = 520+(K-1)*38 = 786   // total reveal duration (ms) — CSS default --reveal is .52s=520ms
gt = 260         // ms — old content hidden this far into a route change
wt = 340         // ms — extra hold after cover completes before reveal starts
oe = 1100        // ms — minimum boot-loader duration (raced against document.fonts.ready)
yt = 3000        // ms — hard timeout fallback for the boot loader
```
CSS side (`index-sXIK4by5.css.beautified.css:606-665`): `.sv-curtain` has 8 `.sv-curtain-col` panels (`--cw:12.5vw` each = 100vw), cream paper background (`#fbf7e6` → `#f3edd6` gradient) with a `2px #f3b44a` amber bottom rule; each column's `transition-delay: calc(var(--i)*var(--stagger))` staggers the wipe, `cubic-bezier(.72,0,.22,1)` easing, reversed delay order (`(n-1-i)`) on reveal so the last-covered column uncovers first.
Route-change sequence (`:2476-2490`): `"arm"` → double-`requestAnimationFrame` → `"cover"` state (triggers the CSS wipe-in) → at `gt=260ms` old page content is hidden → at `ae=746ms` the actual route swap + `scrollTo(0,0)` happens, state → `"covered"` → at `ae+wt=1086ms` state → `"reveal"` (wipe-out) → at `se+60=846ms` later, state → `"idle"`. Reduced-motion users skip straight to the route swap with no curtain.
First-visit boot loader (`:2491-2525`): gated by `sessionStorage["sv-boot-seen"]` (once per session) and `prefers-reduced-motion`; progress bar (`--p` custom property, 0–100) driven by `requestAnimationFrame`, computed as `min(92, elapsed/1100*92)` until `Promise.all([document.fonts.ready, timeout(1100)])` resolves, then jumps `+7`/frame to 100; hard-capped at 3000ms (`yt`) even if fonts never resolve. **What it does:** an 8-panel torn-paper "curtain" wipe used both as the very first boot/intro animation and as the transition between client-side route changes — reduced-motion-aware, timed to real font-load completion rather than a fixed guess.

### 5. "Board-walk" chip marquee + walking robot — `$e()` in `theme-CvJK8SGN.js:846-984`
Time-based (not scroll-based) infinite horizontal marquee of PCB-chip SVGs with a walking robot mascot, used in the site footer (`De()` Footer component, `:1352-1364`, fed `ie.map(...)` — a tools/skills list imported from the main bundle) and reused as the `/work` and `/ai` route hero backgrounds via `Console-CyBRxdTz.js`'s scene components. Constants (`:305-309`): `b=300` (px per chip segment) `d=118` (baseline y) `Z=168` (viewBox height) `pe=190` (px/sec scroll speed) `V=60` (ground-pad spacing). Robot x-position/viewBox width switch at the `(min-width:761px)` media query (`:850`: desktop `v=1560,N=300`; mobile `v=1040,N=190`). Animation loop (`:856-866`) uses `performance.now()` delta-time (capped `Math.min(64, dt)` to avoid jumps on tab-refocus), advances `p = (p + 190*dt/1000) % loopLength`, applies `translateX(-p)` to the chip world and a separately-modulo'd `translateX(-(p%60))` to the ground-pad layer (parallax). Clicking the stage triggers an `"is-met"` wave state with a "Hi 👋" speech-bubble for 1700ms (`:868-871`). **What it does:** a continuous, speed-constant conveyor-belt marquee (not scroll-linked) of the skills/tools list, walked past by an SVG robot, with a click-triggered greeting easter egg.

### 6. "Ledger" — Teams/profile card grid (`Ledger-DHCOg5iE.js`, full file, 53 lines)
A thin wrapper: renders a `<section id="profile" data-badge="Teams">` with a heading (via `theme-CvJK8SGN.js`'s `Be`) and a `.sv-board` grid of `.sv-card` articles (index badge `A{n}`, name, role, note), animated purely via the `Fe()`/`i` stagger-reveal hook (component 2 above) with `{from:.96, rise:12, start:.94, span:.36, overlap:.5}`. Not a ledger/finance UI at all — just a codename for a people/testimonials-style card row.

### 7. "Commuter" — hand-illustrated pedestrian SVG system (`Commuter-BHE77-Jm.js`, full file, 472 lines)
Not transportation logic — a fully hand-drawn cartoon pedestrian: articulated legs (`r()`, hip/knee/foot rotation props), an arm with a clipped coat-sleeve mask and swappable hand states (`m()`), a face with individually-pathed eyes/pupils/brows/ears/hair (`x()`), a coffee cup being carried (`o()`), and a bag. Three posed variants exported: `l6`/`C` (generic idle walker, animated by the CSS `sv-walk-*` keyframes above), `o6`/`a` ("is-playing" — arm cocked at `shoulder:-54deg, elbow:-20deg` for a rock/paper/scissors throw, hand shape supplied by `f()`/`T`, which draws distinct paper/scissors/rock hand SVGs at `:9-47`), and `x6`/`b` ("is-knocking" — arm at `shoulder:-104deg`, with a "rap" sound-ring effect `<path class="ring r0/r1">`). **What it does:** the cast of tiny walking-figure illustrations scattered through the site's street-view/hero scenes, each a fully rigged SVG puppet rather than a photo or off-the-shelf icon.

### 8. "Console" — interactive fake-terminal "AI workflow" demo (`Console-CyBRxdTz.js:780-1159`, component `bs`/exported as `C`)
A self-contained mock IDE/terminal widget: a sidebar of selectable "jobs" (either `expertiseTabs` content for the home "workspace" mode, or real project data for a `/work`-style "index" mode), a canvas area that swaps between four illustrated mock-UI scenes (`ps` design-decision flowchart, `xs` AI-agent build pipeline, `ms` design-token sync, `js` research→ship flow) depending on which job/tab is open, and a typed command log fed by a setTimeout ladder (`u()`, `:961-968`, each line delayed `ls*(i+1) = 130*(i+1)` ms) simulating a CLI session (`open <id>`, `list`, `tags`, `next`, `clear`, `help` — real command parser at `:983-1014`). An `<input>` accepts free-typed commands. Wrapped in `E()` (`:84-139`), a freehand pointer-draw "ink" annotation layer (SVG `<path>` built from pointer move events, viewBox 1000×600, double-click to clear) — you can literally doodle on top of the terminal mockup. **What it does:** the site's demonstration of "AI-native workflow" (per the meta description) as a playable fake terminal rather than a static screenshot — directly ties to the homepage/`_person.description` copy about building AI-native workflows.

### 9. "asset" (`asset-BaG-jDRI.js`, full file, 6 lines) — trivial URL helper, not a component
```js
function r(t){ return t ? /^(https?:)?\/\//.test(t)||t.startsWith("data:")||t.startsWith("/") ? t : `/${t}` : "" }
```
Prefixes a bare path with `/` unless it's already absolute/protocol-relative/`data:`. Used everywhere images are rendered (`Console-CyBRxdTz.js:32,879,902` etc.).

### 10. `Ve()` scroll-pin/steps hook (`theme-CvJK8SGN.js:188-218`, exported `b`)
A generic "pin this element for N steps of scroll" utility: sets `container.style.height = calc(100vh + (steps-1)*stepVh vh)` (default `stepVh=95`), then on scroll computes `progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1)` via rAF and returns it as React state. This is the primitive a scrollytelling section would use to pin content while scrubbing through steps (I did not find its call site inside the 6 route/section chunks fetched — likely used in `SiteWork`/`SiteCase`, which were not in scope; flagging for the live-render half or a follow-up fetch).

## Glossary — what the codenamed chunks actually are

| Chunk | Actually is |
|---|---|
| **SiteHome** | The `/` route component. Renders hero (headline + sub via `Ce`/`Be`), a scrolling logo/skills marquee/ticker, then assembles the Ledger (Teams cards), Console (AI-tools grid + interactive terminal demo), and Commuter (illustrated street scene) sections. Also owns the page-level `Ke()`/`Pe()` calls that put `is-dark`/`pal-mm` classes on `.site-root`. |
| **theme** (`theme-CvJK8SGN.js` / `theme-DOAwoE7X.css`) | Not just a dark/light switch — it's the shared UI-kit chunk: site `<nav>`, `<footer>`, the wordmark SVG logo, all scroll/reveal hooks, the custom momentum-scroll, the "board-walk" chip marquee + robot, button/link/arrow atoms, and (in the CSS) essentially all of the public site's visual design system (~87 keyframes, all `.sv-*` classes). |
| **Commuter** | A rigged, hand-drawn SVG pedestrian character (walk cycle, rock-paper-scissors throw pose, knocking pose) — nothing to do with transit/commuting logic; it's an illustration asset, code-named after what it depicts. |
| **Ledger** | A "Teams"/profile card-grid section component (`id="profile"`) — not a financial ledger. Thin wrapper (53 lines) around the shared stagger-reveal hook. |
| **Console** | A playable fake developer terminal + AI-agent-workflow visualization used to demonstrate "AI-native workflows" (the site's stated positioning) — plus, separately, the "AI tools" logo grid. Genuinely console-shaped (command line, sidebar, log). |
| **asset** | Trivial 6-line URL-prefixing helper — not a UI component at all. |
| **UIKit** (extra fetch) | The private `/ui` route: a live, in-app component-library/design-system showcase page (buttons, cards, tags, badges, type scale, tokens) — the "internal bench" `robots.txt` disallows. Uses its own lime/mint accent, separate from the public amber palette. |
| **index-D8zjrZIf / index-Di0mkZEe.css** (extra fetch) | The private `/editor` route: a live CSS-custom-property override tool (generates `html.mode-light:root {...} !important` rule strings, persists to `localStorage["pleurat:editor:v2"]`) — also `robots.txt`-disallowed. |

## Blockers / things the other half should verify live

- Could not confirm whether the `theme-pref`/`sv-theme` localStorage-key mismatch (Color palettes §, item 2) actually produces a visible flash on a returning light-mode visitor — needs a live browser with a pre-seeded `localStorage["sv-theme"]="light"` to observe.
- `Ve()` (scroll-pin/steps hook) has no call site in any of the 6 fetched route/section chunks — likely lives in `SiteWork-CLDoUXyQ.js` or `SiteCase-BNC6h7lD.js`, which are out of my assigned scope and were not fetched.
- No bot-challenge/CDN block encountered on any of the 15 fetched files; all returned real JS/CSS (verified byte counts and content, not just HTTP 200).
