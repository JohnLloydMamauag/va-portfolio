// Engine #3 — IntersectionObserver line/fade reveal.
// Ported from te()/ne/Ce/Be, source/js/theme-CvJK8SGN.js.beautified.js:122-152.
// One-shot: threshold .16, plus a requestAnimationFrame+260ms setTimeout double-fire
// fallback for elements already in view at mount (se() visibility check). CSS classes
// .sv-rv/.sv-lines/.sv-fade + .is-in do the actual animation (css/style.css).
const THRESHOLD = 0.16;

function isVisible(el) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0 && r.width > 0;
}

export function initIoReveal(root = document) {
  const targets = root.querySelectorAll('.sv-rv, .sv-lines, .sv-fade');
  const cleanups = [];
  targets.forEach((el) => {
    let fired = false;
    let raf = 0, timer = 0;
    const fire = () => {
      if (fired) return;
      fired = true;
      el.classList.add('is-in');
      cleanup();
    };
    const arm = () => {
      if (!isVisible(el)) return false;
      raf = requestAnimationFrame(fire);
      timer = window.setTimeout(fire, 260);
      return true;
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) fire(); });
    }, { threshold: THRESHOLD });
    io.observe(el);
    arm();
    const onVis = () => { if (!document.hidden) arm(); };
    document.addEventListener('visibilitychange', onVis);
    function cleanup() {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    }
    cleanups.push(cleanup);
  });
  return () => cleanups.forEach((c) => c());
}
