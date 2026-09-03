// Engine #1 — custom momentum scroll.
// Ported from ve(), source/js/theme-CvJK8SGN.js.beautified.js:44-120.
// Original constants: me=.115 (spring factor), xe=16 (px per wheel "line"), ue=.4 (settle
// threshold px). React hook -> plain function, same math, same event wiring.
const SPRING = 0.115;   // me
const LINE_PX = 16;     // xe
const SETTLE_PX = 0.4;  // ue

function navAnchorTarget(el) {
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sv-nav-h')) || 62;
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - navH - 18);
}

export function initMomentumScroll() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onAnchorClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const y = navAnchorTarget(target);
    if (reduced) { window.scrollTo(0, y); return; }
    if (coarse) { window.scrollTo({ top: y, behavior: 'smooth' }); return; }
    pos = Math.min(maxScroll(), Math.max(0, y));
    kick();
  };
  document.addEventListener('click', onAnchorClick);
  if (coarse || reduced) return () => document.removeEventListener('click', onAnchorClick);

  let pos = window.scrollY;   // a
  let real = pos;             // r
  let raf = 0;                // c
  let lastNative = window.scrollY; // o
  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const halt = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };

  const step = () => {
    const delta = pos - real;
    if (Math.abs(delta) < SETTLE_PX) {
      real = pos; window.scrollTo(0, real); lastNative = window.scrollY; raf = 0;
      return;
    }
    real += delta * SPRING;
    window.scrollTo(0, real);
    lastNative = window.scrollY;
    raf = requestAnimationFrame(step);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };

  const onWheel = (e) => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const scrollable = e.target.closest && e.target.closest('.sv-cn-log, .sv-report-sheet .scroll');
    if (scrollable && scrollable.scrollHeight > scrollable.clientHeight) return;
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * LINE_PX : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
    pos = Math.min(maxScroll(), Math.max(0, pos + dy));
    kick();
  };
  const onNativeScroll = () => {
    if (Math.abs(window.scrollY - lastNative) < 2) return;
    pos = real = window.scrollY; lastNative = window.scrollY; halt();
  };
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onNativeScroll, { passive: true });

  return () => {
    halt();
    document.removeEventListener('click', onAnchorClick);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('scroll', onNativeScroll);
  };
}
