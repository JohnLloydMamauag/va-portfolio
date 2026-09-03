// Engine #2 — scroll-linked stagger reveal with a custom backOut easing.
// Ported from Fe()/i, source/js/theme-CvJK8SGN.js.beautified.js:235-304, verbatim math:
//   C = 1/N
//   H = clamp((innerHeight*start - rect.top) / (innerHeight*span), 0, 1)
//   A = clamp((H - k*C) / (C*overlap), 0, 1)      // per item k
//   O = backOut(A)   where backOut(y) = 1 + (c3)*(y-1)^3 + c1*(y-1)^2, c1=1.7, c3=2.7
//   opacity = clamp(A*1.6, 0, 1); transform = translateY((1-O)*rise) scale(from+(1-from)*O)
// Re-triggers on MutationObserver (child list changes), respects reduced-motion/hidden.
export function initStaggerReveal(container, selector, opts = {}) {
  const { from = 0.9, rise = 16, start = 0.78, span = 0.68, overlap = 0.85 } = opts;
  if (!container) return () => {};
  const query = () => Array.from(container.querySelectorAll(selector));
  let items = query();
  if (!items.length) return () => {};

  const settle = () => items.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) { settle(); return () => {}; }

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const backOut = (p) => { const y = p - 1; return 1 + (1.7 + 1) * y * y * y + 1.7 * y * y; };
  const markWillChange = () => items.forEach((el) => { el.style.willChange = 'transform, opacity'; });
  markWillChange();

  let raf = 0, lastH = -1;
  const update = () => {
    raf = 0;
    const n = items.length;
    const C = 1 / n;
    const rect = container.getBoundingClientRect();
    const H = clamp((window.innerHeight * start - rect.top) / (window.innerHeight * span), 0, 1);
    if (H === lastH) return;
    lastH = H;
    for (let k = 0; k < n; k++) {
      const A = clamp((H - k * C) / (C * overlap), 0, 1);
      const O = backOut(A);
      items[k].style.opacity = clamp(A * 1.6, 0, 1).toFixed(3);
      items[k].style.transform = `translateY(${((1 - O) * rise).toFixed(2)}px) scale(${(from + (1 - from) * O).toFixed(4)})`;
    }
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
  update();

  const mo = new MutationObserver(() => {
    items = query();
    if (items.length) { markWillChange(); lastH = -1; update(); }
  });
  mo.observe(container, { childList: true, subtree: true });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);

  return () => {
    mo.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (raf) cancelAnimationFrame(raf);
  };
}
