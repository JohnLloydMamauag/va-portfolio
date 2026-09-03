// Engine #5 — "board-walk" PCB chip marquee + walking robot.
// Ported from $e(), source/js/theme-CvJK8SGN.js.beautified.js:846-984, plus its helper
// components: we() chip (311-358), the 10 part primitives P/I/T/Y/B/_/z/W/X/ge (359-523),
// Q() silkscreen label (524-533), Ne() signal trace (534-539), U()/G() leg+arm rig
// (543-627), ye() robot "front" pose (628-756), be() robot placement incl. "side"/"jump"/
// "hull" walk rig (758-844). Constants:
//   b=300 (chip cell width), d=118 (baseline y), Z=168 (viewBox height),
//   pe=190 (px/sec desktop conveyor speed, 300 narrower breakpoint not modeled here),
//   V=60 (ground-pad spacing, separately modulo'd for parallax)
// Time-based (performance.now() delta, capped 64ms): p = (p + 190*dt/1000) % loopLength
const NS = 'http://www.w3.org/2000/svg';
const CELL_W = 300;   // b
const BASE_Y = 118;   // d
const VB_H = 168;     // Z
const SPEED = 190;    // pe, px/sec
const PAD_SPACING = 60; // V
const LEAD_OFFSET = 300; // N (desktop "camera" lead, matches h ? 300 : 190 for >=761px)
const d = BASE_Y; // shorthand matching source variable name, used throughout part builders

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(NS, tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}
function withChildren(el, children) {
  children.forEach((c) => c && el.appendChild(c));
  return el;
}
function textEl(tag, attrs, text) {
  const el = svgEl(tag, attrs);
  el.textContent = text;
  return el;
}

// ---------- we() — the real per-chip component (line 311-358) ----------
// Variable width/height per chip index + a dynamic pin count along the bottom edge.
function buildChip(i, label, isOn) {
  const w = [96, 120, 78, 108][i % 4];
  const h = [52, 64, 42, 58][(i * 3) % 4];
  const cx = i * CELL_W + (CELL_W - w) / 2;
  const cy = BASE_Y - h;
  const pinCount = Math.max(3, Math.round(w / 16));
  const g = svgEl('g', { class: `chip${isOn ? ' is-on' : ''}` });
  g.dataset.chipIx = i;
  for (let j = 0; j < pinCount; j++) {
    const lx = cx + 10 + j * ((w - 20) / (pinCount - 1));
    g.appendChild(svgEl('path', { class: 'pin', d: `M${lx} ${cy + h} v7` }));
  }
  g.appendChild(svgEl('rect', { class: 'chip-body', x: cx, y: cy, width: w, height: h, rx: '3' }));
  g.appendChild(svgEl('circle', { class: 'chip-dot', cx: cx + 9, cy: cy + 9, r: '2.6' }));
  g.appendChild(svgEl('rect', { class: 'die', x: cx + 16, y: cy + 16, width: w - 32, height: h - 28, rx: '1.5' }));
  g.appendChild(textEl('text', { class: 'chip-label', x: cx + w / 2, y: cy + h / 2 + 4, 'text-anchor': 'middle' }, label));
  return g;
}

// ---------- ten "part" components (line 359-523) — copied verbatim, geometry relative to x/d ----------
const partCap = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('rect', { class: 'cap', x: x - 7, y: d - 26, width: 14, height: 26, rx: '6' }),
  svgEl('path', { class: 'pin', d: `M${x - 3} ${d} v6 M${x + 3} ${d} v6` }),
  svgEl('path', { class: 'cap-band', d: `M${x - 7} ${d - 19} h14` }),
]);
const partRes = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('path', { class: 'pin', d: `M${x - 14} ${d - 7} h28` }),
  svgEl('rect', { class: 'res', x: x - 9, y: d - 14, width: 18, height: 14, rx: '2.5' }),
  svgEl('path', { class: 'res-band', d: `M${x - 4} ${d - 14} v14 M${x + 2} ${d - 14} v14` }),
]);
const partLed = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('circle', { class: 'led-halo', cx: x, cy: d - 9, r: '9' }),
  svgEl('circle', { class: 'led', cx: x, cy: d - 9, r: '4.4' }),
  svgEl('path', { class: 'pin', d: `M${x - 3} ${d - 5} v5 M${x + 3} ${d - 5} v5` }),
]);
const partVia = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('circle', { class: 'via', cx: x, cy: d - 6, r: '3.4' }),
]);
const partLedStalk = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('path', { class: 'pin', d: `M${x} ${d} V${d - 40} q0 -7 9 -7` }),
  svgEl('circle', { class: 'led-halo', cx: x + 11, cy: d - 47, r: '7' }),
  svgEl('circle', { class: 'led', cx: x + 11, cy: d - 47, r: '3.2' }),
]);
const partCan = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('rect', { class: 'can', x: x - 11, y: d - 17, width: 22, height: 17, rx: '8' }),
  svgEl('path', { class: 'can-line', d: `M${x - 6} ${d - 13} h12` }),
  svgEl('path', { class: 'pin', d: `M${x - 6} ${d} v6 M${x + 6} ${d} v6` }),
]);
const partHdr = (x) => {
  const g = svgEl('g', { class: 'part' });
  g.appendChild(svgEl('rect', { class: 'hdr', x: x - 15, y: d - 8, width: 30, height: 8, rx: '1.5' }));
  for (let n = 0; n < 5; n++) g.appendChild(svgEl('path', { class: 'pin', d: `M${x - 12 + n * 6} ${d - 8} v-9` }));
  return g;
};
const partTran = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('path', { class: 'tran', d: `M${x - 8} ${d - 6} a8 8 0 0 1 16 0 z` }),
  svgEl('path', { class: 'pin', d: `M${x - 4} ${d - 6} v6 M${x} ${d - 6} v6 M${x + 4} ${d - 6} v6` }),
]);
const partCoil = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('path', { class: 'coil', d: `M${x - 12} ${d} q3 -11 6 0 q3 -11 6 0 q3 -11 6 0 q3 -11 6 0` }),
]);
const partPort = (x) => withChildren(svgEl('g', { class: 'part' }), [
  svgEl('rect', { class: 'port', x: x - 13, y: d - 13, width: 26, height: 13, rx: '6' }),
  svgEl('rect', { class: 'port-in', x: x - 8, y: d - 10, width: 16, height: 6, rx: '3' }),
]);

function buildSilk(x, t) {
  return textEl('text', { class: 'silk', x, y: d + 26, 'text-anchor': 'middle' }, t);
}
function buildSig(x, up) {
  return svgEl('path', { class: 'sig', d: `M${x} ${d - 2} v${-up + 24} l24 -24 h48` });
}

// E: the 10 part components in a specific repeating order, 24 entries (line 541).
const E = [
  partCap, partLedStalk, partRes, partCan, partLed, partVia, partHdr,
  partCap, partLedStalk, partTran, partRes, partCoil, partLed, partPort, partVia,
  partCap, partLedStalk, partCan, partRes, partTran, partCoil, partLed, partHdr, partVia,
];
// F: 10 silkscreen label strings (line 542).
const F = ['R1', 'C4', 'U2', 'D7', 'L3', 'J1', 'Q5', 'X1', 'C9', 'R12'];

// ---------- U() leg / G() arm — walking robot's limb rig (line 543-627) ----------
function buildLeg(side) {
  const knee = withChildren(svgEl('g', { class: 'knee' }), [
    svgEl('rect', { class: 'limb', x: '-2.8', y: '0', width: '5.6', height: '10', rx: '2' }),
    svgEl('rect', { class: 'foot', x: '-4.6', y: '9.4', width: '9.6', height: '4', rx: '1.2' }),
  ]);
  const kneeWrap = svgEl('g', { transform: 'translate(0 12)' });
  kneeWrap.appendChild(knee);
  const thigh = withChildren(svgEl('g', { class: 'thigh' }), [
    svgEl('rect', { class: 'limb', x: '-3.2', y: '0', width: '6.4', height: '11', rx: '2' }),
    svgEl('circle', { class: 'joint', cx: '0', cy: '11.5', r: '2.8' }),
    kneeWrap,
  ]);
  const leg = svgEl('g', { class: `leg leg-${side}`, transform: 'translate(1.5 -26)' });
  leg.appendChild(thigh);
  return leg;
}
function buildArm(side) {
  const elbow = withChildren(svgEl('g', { class: 'elbow' }), [
    svgEl('rect', { class: 'limb', x: '-2.4', y: '0', width: '4.8', height: '8', rx: '2' }),
    svgEl('rect', { class: 'grip', x: '-3', y: '7.4', width: '6', height: '4.4', rx: '1.6' }),
  ]);
  const elbowWrap = svgEl('g', { transform: 'translate(0 10)' });
  elbowWrap.appendChild(elbow);
  const shoulder = withChildren(svgEl('g', { class: 'shoulder' }), [
    svgEl('rect', { class: 'limb', x: '-2.6', y: '0', width: '5.2', height: '9', rx: '2' }),
    svgEl('circle', { class: 'joint', cx: '0', cy: '9.4', r: '2.4' }),
    elbowWrap,
  ]);
  const arm = svgEl('g', { class: `arm arm-${side}`, transform: 'translate(1.2 -44)' });
  arm.appendChild(shoulder);
  return arm;
}

// ---------- ye() — robot "front" static pose, shown when greeted/idle (line 628-756) ----------
function buildFrontPose() {
  const g = svgEl('g', { class: 'front', 'aria-hidden': 'true' });
  const wave = withChildren(svgEl('g', { class: 'wave' }), [
    svgEl('rect', { class: 'limb', x: '10.5', y: '-45', width: '5', height: '16', rx: '2' }),
    svgEl('rect', { class: 'grip', x: '10', y: '-48.5', width: '6', height: '5', rx: '1.8' }),
  ]);
  withChildren(g, [
    svgEl('ellipse', { class: 'shadow', cx: '0', cy: '1.5', rx: '14', ry: '2.6' }),
    svgEl('rect', { class: 'limb', x: '-8.4', y: '-24', width: '6.4', height: '20', rx: '2' }),
    svgEl('rect', { class: 'limb', x: '2', y: '-24', width: '6.4', height: '20', rx: '2' }),
    svgEl('rect', { class: 'foot', x: '-10', y: '-5', width: '9.6', height: '4', rx: '1.2' }),
    svgEl('rect', { class: 'foot', x: '0.4', y: '-5', width: '9.6', height: '4', rx: '1.2' }),
    svgEl('rect', { class: 'body', x: '-11', y: '-46', width: '22', height: '23', rx: '4.5' }),
    svgEl('rect', { class: 'vent', x: '-6', y: '-41', width: '12', height: '1.8', rx: '.9' }),
    svgEl('rect', { class: 'vent', x: '-6', y: '-37.4', width: '12', height: '1.8', rx: '.9' }),
    svgEl('circle', { class: 'core', cx: '0', cy: '-31', r: '4' }),
    svgEl('rect', { class: 'limb', x: '-15.5', y: '-44', width: '5', height: '17', rx: '2' }),
    wave,
    svgEl('rect', { class: 'neck', x: '-2.4', y: '-50', width: '4.8', height: '4.6' }),
    svgEl('rect', { class: 'head', x: '-11', y: '-64', width: '22', height: '14.5', rx: '4.5' }),
    svgEl('rect', { class: 'visor', x: '-7.4', y: '-60.4', width: '14.8', height: '6.4', rx: '2.6' }),
    svgEl('circle', { class: 'eye', cx: '-3.4', cy: '-57.2', r: '1.5' }),
    svgEl('circle', { class: 'eye', cx: '3.4', cy: '-57.2', r: '1.5' }),
    svgEl('path', { class: 'ant', d: 'M0 -64 v-7' }),
    svgEl('circle', { class: 'ant-led', cx: '0', cy: '-72.5', r: '2.4' }),
  ]);
  return g;
}

// ---------- be({x,y}) — robot placed in the scene: front pose + walking "side" rig (line 758-844) ----------
function buildRobot(x, y) {
  const hull = withChildren(svgEl('g', { class: 'hull' }), [
    buildLeg('b'),
    buildArm('b'),
    svgEl('rect', { class: 'body', x: '-8', y: '-46', width: '18.5', height: '21', rx: '4' }),
    svgEl('rect', { class: 'vent', x: '-4.6', y: '-41', width: '11.5', height: '1.8', rx: '.9' }),
    svgEl('rect', { class: 'vent', x: '-4.6', y: '-37.4', width: '11.5', height: '1.8', rx: '.9' }),
    svgEl('circle', { class: 'core', cx: '1.2', cy: '-31', r: '3.4' }),
    buildLeg('a'),
    buildArm('a'),
    svgEl('rect', { class: 'neck', x: '-1', y: '-50', width: '4.6', height: '4.6' }),
    svgEl('rect', { class: 'head', x: '-7.5', y: '-63', width: '18', height: '13.5', rx: '4' }),
    svgEl('rect', { class: 'visor', x: '-3.4', y: '-59.6', width: '12', height: '5.6', rx: '2.4' }),
    svgEl('path', { class: 'ant', d: 'M6.5 -63 v-7' }),
    svgEl('circle', { class: 'ant-led', cx: '6.5', cy: '-71.5', r: '2.4' }),
  ]);
  const jump = svgEl('g', { class: 'jump' });
  jump.appendChild(hull);
  const side = withChildren(svgEl('g', { class: 'side' }), [
    svgEl('ellipse', { class: 'shadow', cx: '1', cy: '1.5', rx: '13', ry: '2.4' }),
    jump,
  ]);
  const robot = svgEl('g', { class: 'robot', transform: `translate(${x} ${y})` });
  robot.appendChild(buildFrontPose());
  robot.appendChild(side);
  return robot;
}

export function initBoardWalk(chips) {
  const root = document.getElementById('sv-board-walk');
  const stage = document.getElementById('sv-board-stage');
  const world = document.getElementById('sv-board-world');
  const pads = document.getElementById('sv-board-pads');
  const readEl = document.getElementById('sv-board-read');
  const viewEl = root && root.querySelector('.sv-board-view');
  const hiEl = document.getElementById('sv-board-hi');
  if (!root || !world) return () => {};

  const n = chips.length;
  const loopLen = n * CELL_W;
  const vbW = 1560; // v, desktop viewBox width
  viewEl.style.aspectRatio = `${vbW} / ${VB_H}`;
  root.querySelector('svg').setAttribute('viewBox', `0 0 ${vbW} ${VB_H}`);

  // Build 3 looping copies of the chip row (seamless scroll), fully assembled per source's
  // per-chip block (line 934-961): [Ne, we, 4x part-from-E, 2x Q] + a shared trace line.
  for (let copy = 0; copy < 3; copy++) {
    const g = svgEl('g', { transform: `translate(${copy * loopLen} 0)` });
    chips.forEach((chip, m) => {
      const partA = E[(m * 4) % E.length];
      const partB = E[(m * 4 + 1) % E.length];
      const partC = E[(m * 4 + 2) % E.length];
      const partD = E[(m * 4 + 3) % E.length];
      const item = svgEl('g', {});
      withChildren(item, [
        buildSig(m * CELL_W + 40, 40 + (m * 17) % 40),
        buildChip(m, chip.name, false),
        partA(m * CELL_W + 34),
        partB(m * CELL_W + 74),
        partC(m * CELL_W + CELL_W - 74),
        partD(m * CELL_W + CELL_W - 32),
        buildSilk(m * CELL_W + 74, F[m % F.length]),
        buildSilk(m * CELL_W + CELL_W - 74, F[(m * 3 + 1) % F.length]),
      ]);
      g.appendChild(item);
    });
    const trace = svgEl('path', { class: 'trace', d: `M0 ${BASE_Y} H${loopLen}` });
    g.appendChild(trace);
    world.appendChild(g);
  }
  const padCount = Math.ceil((vbW + 200) / PAD_SPACING) + 2;
  for (let f = 0; f < padCount; f++) {
    const g = svgEl('g', {});
    withChildren(g, [
      svgEl('circle', { class: 'pad', r: '3', cx: f * PAD_SPACING - PAD_SPACING, cy: BASE_Y + 14 }),
      svgEl('circle', { class: 'pad-hole', r: '1.2', cx: f * PAD_SPACING - PAD_SPACING, cy: BASE_Y + 14 }),
    ]);
    pads.appendChild(g);
  }

  // Robot rig: front pose (idle/greeted) + side/jump/hull walk pose (line 758-844). CSS
  // decides visibility (.robot .front / .robot .side, toggled by .sv-board-walk.is-met) and
  // drives the walk-cycle keyframes (sv-step-hip/-knee/-arm) + sv-core pulse.
  const robot = buildRobot(LEAD_OFFSET, BASE_Y + 4);
  world.parentElement.appendChild(robot);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let raf = 0, last = performance.now(), pos = 0, activeIx = -1;
  const setActive = (ix) => {
    if (ix === activeIx) return;
    activeIx = ix;
    world.querySelectorAll('.chip.is-on').forEach((c) => c.classList.remove('is-on'));
    world.querySelectorAll(`.chip[data-chip-ix="${ix}"]`).forEach((c) => c.classList.add('is-on'));
    const chip = chips[ix];
    readEl.innerHTML = `<span class="ix">${String(ix + 1).padStart(2, '0')}</span><span class="say"><span class="name">${chip.name}</span><span class="role">${chip.role || ''}</span></span>`;
  };
  const frame = (now) => {
    const dt = Math.min(64, now - last);
    last = now;
    pos = (pos + SPEED * dt / 1000) % loopLen;
    world.style.transform = `translateX(${(-pos).toFixed(2)}px)`;
    pads.style.transform = `translateX(${(-(pos % PAD_SPACING)).toFixed(2)}px)`;
    const ix = Math.floor(((pos + LEAD_OFFSET) % loopLen) / CELL_W) % n;
    setActive(ix);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  let metTimer = 0;
  stage.addEventListener('click', () => {
    root.classList.add('is-met');
    hiEl.hidden = false;
    hiEl.style.left = `${(LEAD_OFFSET + 34) / vbW * 100}%`;
    clearTimeout(metTimer);
    metTimer = window.setTimeout(() => { root.classList.remove('is-met'); hiEl.hidden = true; }, 1700);
  });

  return () => { if (raf) cancelAnimationFrame(raf); clearTimeout(metTimer); };
}
