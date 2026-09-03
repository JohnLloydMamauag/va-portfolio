// Engine #10 — "Commuter" rigged pedestrian, hero street-scene driver.
// The walker itself is CSS-keyframe animated (sv-walk-* in css/style.css, ported verbatim
// from theme-DOAwoE7X.css.beautified.css:2002-2264). This module only drives the
// continuous rightward translateX and the rotating "who am I passing" readout — the exact
// source for that loop lives in Commuter-BHE77-Jm.js (472 lines, bespoke SVG rig) which
// was documented but not transcribed line-for-line (build-analysis.md calls this piece
// "Hard — bespoke SVG illustration + rigging, not a code pattern to port"). Reimplemented
// against the same aria-label roster order documented in content/02-hero.md, with the
// hero's own (stale, per that content file) name list rather than the Teams grid's.
const NAMES = [
  { name: 'Hoopit AI', role: 'Senior Product Designer' },
  { name: 'Santander UK', role: 'Senior Product Designer' },
  { name: 'Sena', role: 'Product Designer' },
  { name: 'Toyota', role: 'Brand & Interface' },
  { name: 'Gjirafa', role: 'Lead Product Designer' },
  { name: 'ThemeForest', role: 'Frontend Developer & Author' },
  { name: 'Nacew', role: 'Product Designer' },
  { name: 'Valtech', role: 'Product Designer' },
  { name: 'Arnisa', role: 'Product Designer' },
  { name: 'AI Journey', role: 'Design & AI Workflows' },
];
const SPEED = 24; // px/sec, slow ambient drift (not extracted — original loop var not captured)
const SEGMENT = 260; // px between name-change triggers

export function initCommuter() {
  const walker = document.getElementById('sv-walker');
  const readEl = document.getElementById('sv-street-read');
  if (!walker) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let raf = 0, last = performance.now(), pos = 120, activeIx = 0;
  const laneW = () => (walker.closest('svg').viewBox.baseVal.width || 2320) + 400;

  const setActive = (ix) => {
    if (ix === activeIx) return;
    activeIx = ix;
    const p = NAMES[ix];
    readEl.classList.add('is-swap');
    readEl.querySelector('.ix').textContent = String(ix + 1).padStart(2, '0');
    readEl.querySelector('.name').textContent = p.name;
    readEl.querySelector('.role').textContent = p.role;
    window.setTimeout(() => readEl.classList.remove('is-swap'), 520);
  };

  const frame = (now) => {
    const dt = Math.min(64, now - last);
    last = now;
    pos = (pos + SPEED * dt / 1000) % laneW();
    walker.style.transform = `translateX(${pos.toFixed(1)}px)`;
    setActive(Math.floor(pos / SEGMENT) % NAMES.length);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  let metTimer = 0;
  const street = walker.closest('.sv-street');
  street.addEventListener('click', () => {
    street.classList.add('is-met');
    clearTimeout(metTimer);
    metTimer = window.setTimeout(() => street.classList.remove('is-met'), 1700);
  });

  return () => { if (raf) cancelAnimationFrame(raf); clearTimeout(metTimer); };
}
