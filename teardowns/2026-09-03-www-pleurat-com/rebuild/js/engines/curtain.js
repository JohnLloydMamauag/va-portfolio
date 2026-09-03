// Engine #4 (boot half only) — page-transition curtain + boot loader.
// Ported from kt(), source/js/index-DwCqBxFL.js.beautified.js:2419-2576.
// This rebuild is a single static page (no client-side router), so only the FIRST-VISIT
// boot sequence applies; the route-change cover/reveal state machine (arm -> cover 746ms
// -> swap -> hold 340ms -> reveal 786ms+60ms) is ported as-is in playRouteTransition() and
// wired to every internal-looking `data-stub` link so the choreography is demonstrable even
// though there is nowhere else to route to.
const K = 8;               // column count
const STAGGER = 38;        // ms per column
const COVER_MS = 480 + (K - 1) * STAGGER;   // ae = 746ms
const REVEAL_MS = 520 + (K - 1) * STAGGER;  // se = 786ms
const HIDE_OLD_MS = 260;   // gt
const HOLD_MS = 340;       // wt
const FONT_RACE_MS = 1100; // oe
const BOOT_CAP_MS = 3000;  // yt

function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

export function initCurtain() {
  const el = document.getElementById('sv-curtain');
  const label = document.getElementById('sv-curtain-label');
  if (!el) return { playRouteTransition() {} };

  const bootSeen = (() => {
    try { return sessionStorage.getItem('sv-boot-seen'); } catch { return '1'; }
  })();
  const shouldBoot = !reducedMotion() && !bootSeen;
  try { sessionStorage.setItem('sv-boot-seen', '1'); } catch {}

  if (!shouldBoot) {
    el.classList.remove('is-on', 'show-label');
    el.style.visibility = 'hidden';
    return { playRouteTransition };
  }

  document.documentElement.style.overflow = 'hidden';
  let raf = 0, done = false, fontsReady = false;
  const start = performance.now();
  Promise.all([
    (document.fonts && document.fonts.ready) || Promise.resolve(),
    new Promise((res) => setTimeout(res, FONT_RACE_MS)),
  ]).then(() => { fontsReady = true; });

  const finish = () => {
    if (done) return;
    done = true;
    document.documentElement.style.overflow = '';
    el.classList.remove('is-boot-active');
    label.classList.remove('is-boot');
    el.classList.add('is-reveal');
    window.setTimeout(() => { el.classList.remove('is-on', 'is-reveal', 'show-label'); }, REVEAL_MS + 60);
  };
  const tick = (now) => {
    if (done) return;
    const pct = fontsReady
      ? Math.min(100, parseFloat(label.style.getPropertyValue('--p') || '0') + 7)
      : Math.min(92, ((now - start) / FONT_RACE_MS) * 92);
    label.style.setProperty('--p', pct.toFixed(2));
    if (pct >= 100) { finish(); return; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  const hardCap = window.setTimeout(finish, BOOT_CAP_MS);
  window.addEventListener('beforeunload', () => { cancelAnimationFrame(raf); clearTimeout(hardCap); });

  return { playRouteTransition };
}

// Route-change choreography, demonstrable on any data-stub link click.
function playRouteTransition(labelText = 'Pleurat Shala') {
  const el = document.getElementById('sv-curtain');
  const label = document.getElementById('sv-curtain-label');
  if (!el) return;
  if (reducedMotion()) return;
  label.classList.remove('is-boot');
  label.querySelector('.name').firstChild.textContent = labelText;
  el.classList.add('is-on');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-cover')));
  window.setTimeout(() => el.classList.add('show-label'), HIDE_OLD_MS);
  window.setTimeout(() => { el.classList.remove('is-cover'); el.classList.add('is-covered'); }, COVER_MS);
  window.setTimeout(() => {
    el.classList.remove('is-covered');
    el.classList.add('is-reveal');
    window.setTimeout(() => { el.classList.remove('is-on', 'is-reveal', 'show-label'); }, REVEAL_MS + 60);
  }, COVER_MS + HOLD_MS);
}
