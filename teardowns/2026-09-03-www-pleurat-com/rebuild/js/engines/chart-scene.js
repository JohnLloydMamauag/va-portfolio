// Pinned scene #1 — "By the numbers" diagram + count-up stats.
// Pin driven by js/engines/scroll-pin.js (Ve()/b primitive). Diagram draw-on keyframes
// (sv-b-*, 5000ms linear, css/style.css) run continuously once visible — matches the live
// probe (source/runtime-probes.json) which found them already running, not scroll-scrubbed.
// The count-up itself IS scroll-triggered (fires once progress > 0), values are documented
// placeholders — see index.html's comment above this section and VERIFICATION.md.
import { initScrollPin } from './scroll-pin.js';

export function initChartScene() {
  const section = document.getElementById('sv-chart-sec');
  const track = document.getElementById('sv-chart-track');
  const stats = document.getElementById('sv-chart-stats');
  if (!section) return () => {};

  let counted = false;
  const runCountUp = () => {
    if (counted) return;
    counted = true;
    stats.querySelectorAll('.stat').forEach((stat) => {
      const target = parseInt(stat.dataset.target, 10) || 0;
      const numEl = stat.querySelector('[data-count]');
      const dur = 900;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        numEl.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const stop = initScrollPin(section, {
    setHeight: false,
    onProgress(p) {
      track.style.setProperty('--progress', p.toFixed(4));
      if (p > 0.05) runCountUp();
    },
  });
  return stop;
}
