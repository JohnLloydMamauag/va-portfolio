// Engine #8 — generic scroll-pin/steps primitive.
// Ported from Ve()/b, source/js/theme-CvJK8SGN.js.beautified.js:188-218.
//   container.height = calc(100vh + (steps-1)*95vh)
//   progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1), via rAF on scroll/resize
// The original's call site for the two pinned scenes (#7 in build-analysis.md) was never
// fetched (out-of-scope route chunk) — this module + its two callers (chart-scene.js,
// mosaic-scrub.js) are a documented reconstruction using the SAME primitive, not a
// transcription of an unseen call site. See VERIFICATION.md.
export function initScrollPin(el, { steps, stepVh = 95, onProgress, setHeight = true }) {
  if (!el) return () => {};
  // The two real pinned scenes on this page have their pin-container height set directly
  // in css/style.css (2385px / 2880px) from source/runtime-probes.json's stickyScenes
  // measurement at the teardown's 1440x900 viewport — more exact than re-deriving it from
  // the vh-based formula (which needs an integer `steps` count this run never recovered).
  // setHeight:false skips the formula and just reads whatever height CSS already gives it.
  if (setHeight && steps) el.style.height = `calc(100vh + ${(steps - 1) * stepVh}vh)`;
  let raf = 0;
  const tick = () => {
    raf = 0;
    const rect = el.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    const progress = range <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / range));
    onProgress(progress);
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
  tick();
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (raf) cancelAnimationFrame(raf);
  };
}
