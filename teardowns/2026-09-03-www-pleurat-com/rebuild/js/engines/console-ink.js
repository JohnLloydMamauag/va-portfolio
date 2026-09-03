// Engine #9b — freehand "ink" doodle layer over the Console widget's canvas.
// Ported from E({children}), source/js/Console-CyBRxdTz.js.beautified.js:81-139.
// Real usage: E() wraps only the per-job "bench" content (ps()/xs()/ms()/js(), each a
// `.sv-cn-bench` div holding the diagram/notes/chat pane) — not the job-list sidebar or the
// terminal log/prompt below it. This rebuild mirrors that: it wraps `.sv-cn-canvas`
// (index.html's equivalent of `.sv-cn-bench`), so the job list `<li>`s and the command
// input/buttons sit entirely outside the ink layer and are never eligible to start a stroke.
// Coordinate mapping + stroke lifecycle are ported 1:1 (line 91-108, 118-120):
//   viewBox is a fixed 1000x600 regardless of the wrapper's rendered size; pointerdown starts
//   a live `M{x} {y}` path (ignored for touch, and for pointerdown targets inside a real
//   control), pointermove appends ` L{x} {y}`, pointerup commits it (only if it actually grew
//   an L segment) into a ring buffer of the last 24 strokes, dblclick clears everything.
const VB_W = 1000; // V
const VB_H = 600;  // _
const NS = 'http://www.w3.org/2000/svg';
// Real exclusion list is ".pane, .sticky, .node, button, a" — this rebuild's console markup
// doesn't have a ".node" class, but does have real controls the real DOM didn't need to name
// here (job-list <li>, the command <input>/<form>): included so "don't start a stroke on a
// real control" holds for THIS DOM, per the task's suggested fallback.
const CONTROL_SELECTOR = '.pane, .sticky, .node, li, button, a, input, form';
const MAX_STROKES = 24;

export function initConsoleInk(wrapEl) {
  if (!wrapEl) return () => {};

  wrapEl.classList.add('sv-ink');

  const layer = document.createElementNS(NS, 'svg');
  layer.setAttribute('class', 'sv-ink-layer');
  layer.setAttribute('viewBox', `0 0 ${VB_W} ${VB_H}`);
  layer.setAttribute('preserveAspectRatio', 'none');
  layer.setAttribute('aria-hidden', 'true');
  wrapEl.appendChild(layer);

  const hint = document.createElement('span');
  hint.className = 'sv-ink-hint';
  hint.setAttribute('aria-hidden', 'true');
  hint.hidden = true;
  hint.textContent = 'Double-click to clear';
  wrapEl.appendChild(hint);

  let drawing = false;
  let liveD = null;
  let liveEl = null;
  const strokes = []; // [{d, el}]

  const toPoint = (e) => {
    const rect = wrapEl.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VB_W;
    const y = ((e.clientY - rect.top) / rect.height) * VB_H;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  };

  const updateHint = () => { hint.hidden = strokes.length === 0; };

  const onPointerDown = (e) => {
    if (e.pointerType === 'touch') return;
    if (e.target.closest(CONTROL_SELECTOR)) return;
    drawing = true;
    try { wrapEl.setPointerCapture(e.pointerId); } catch {}
    liveD = `M${toPoint(e)}`;
    liveEl = document.createElementNS(NS, 'path');
    liveEl.setAttribute('class', 'ink is-live');
    liveEl.setAttribute('d', liveD);
    layer.appendChild(liveEl);
  };
  const onPointerMove = (e) => {
    if (!drawing) return;
    liveD += ` L${toPoint(e)}`;
    liveEl.setAttribute('d', liveD);
  };
  const commit = () => {
    if (!drawing) return;
    drawing = false;
    if (liveD && liveD.includes('L')) {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('class', 'ink');
      path.setAttribute('d', liveD);
      layer.appendChild(path);
      strokes.push({ d: liveD, el: path });
      if (strokes.length > MAX_STROKES) {
        const dropped = strokes.shift();
        dropped.el.remove();
      }
    }
    if (liveEl) { liveEl.remove(); liveEl = null; }
    liveD = null;
    updateHint();
  };
  const onDoubleClick = (e) => {
    if (e.target.closest(CONTROL_SELECTOR)) return;
    strokes.splice(0).forEach((s) => s.el.remove());
    if (liveEl) { liveEl.remove(); liveEl = null; }
    liveD = null;
    drawing = false;
    updateHint();
  };

  wrapEl.addEventListener('pointerdown', onPointerDown);
  wrapEl.addEventListener('pointermove', onPointerMove);
  wrapEl.addEventListener('pointerup', commit);
  wrapEl.addEventListener('pointercancel', commit);
  wrapEl.addEventListener('dblclick', onDoubleClick);

  return () => {
    wrapEl.removeEventListener('pointerdown', onPointerDown);
    wrapEl.removeEventListener('pointermove', onPointerMove);
    wrapEl.removeEventListener('pointerup', commit);
    wrapEl.removeEventListener('pointercancel', commit);
    wrapEl.removeEventListener('dblclick', onDoubleClick);
  };
}
