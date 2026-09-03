// Pinned scene #2 — mosaic horizontal scrub, 20 tiles / --cols:5.
// INFERRED reconstruction (build-analysis.md Gotcha #2: the real driver JS lives in an
// out-of-scope route chunk that was never fetched). Uses the same generic scroll-pin
// primitive as the chart scene: as pin progress 0->1, translateX the grid from its resting
// position to -(gridWidth - viewportWidth), panning all 20 tiles through view once.
import { initScrollPin } from './scroll-pin.js';

export function initMosaicScrub() {
  const section = document.getElementById('sv-mosaic-track');
  const grid = document.getElementById('sv-mosaic-grid');
  if (!section || !grid) return () => {};

  return initScrollPin(section, {
    setHeight: false,
    onProgress(p) {
      const max = Math.max(0, grid.scrollWidth - window.innerWidth);
      grid.style.transform = `translateX(${(-p * max).toFixed(2)}px)`;
    },
  });
}
