// Orchestration for the pleurat.com bo-rebuild study clone.
// Each engine below is a direct or documented-approximate port — see the per-file header
// comments in js/engines/*.js and build-analysis.md's "Animation and Interaction
// Breakdown" (items #1-#10) for citations.
import { initMomentumScroll } from './engines/momentum-scroll.js';
import { initIoReveal } from './engines/io-reveal.js';
import { initStaggerReveal } from './engines/stagger-reveal.js';
import { initCurtain } from './engines/curtain.js';
import { initBoardWalk } from './engines/board-walk.js';
import { initConsole } from './engines/console-widget.js';
import { initChartScene } from './engines/chart-scene.js';
import { initMosaicScrub } from './engines/mosaic-scrub.js';
import { initFocusTabs } from './engines/focus-tabs.js';
import { initCommuter } from './engines/commuter.js';

// ---------- Theme toggle — Ke(), theme-CvJK8SGN.js:1426-1439 (system 1, amber/paper).
// Reads/writes localStorage['sv-theme']. The FOUC key mismatch bug (index.html's inline
// script originally read 'theme-pref', never written by anything) is NOT reproduced — the
// inline script in this rebuild's <head> already reads 'sv-theme'. Documented in
// VERIFICATION.md Gate 7 as a deliberate deviation, not an oversight.
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('sv-lights');
  const siteRoot = document.querySelector('.site-root');
  const apply = (dark) => {
    if (dark) { root.setAttribute('data-theme', 'dark'); siteRoot.classList.add('is-dark'); }
    else { root.removeAttribute('data-theme'); siteRoot.classList.remove('is-dark'); }
    btn.setAttribute('aria-pressed', String(!dark));
    btn.setAttribute('aria-label', dark ? 'Switch to light' : 'Switch to dark');
  };
  btn.addEventListener('click', () => {
    const nowDark = !siteRoot.classList.contains('is-dark');
    apply(nowDark);
    try { localStorage.setItem('sv-theme', nowDark ? 'dark' : 'light'); } catch {}
  });
}

// ---------- Mobile nav sheet toggle ----------
function initNavSheet() {
  const toggle = document.getElementById('sv-nav-toggle');
  const sheet = document.getElementById('sv-nav-menu');
  toggle.addEventListener('click', () => {
    const open = sheet.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    sheet.setAttribute('aria-hidden', String(!open));
  });
  sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    sheet.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    sheet.setAttribute('aria-hidden', 'true');
  }));
}

// ---------- data-stub links: study rebuild has no other routes, so internal nav links
// play the curtain route-transition choreography (engine #4) and settle back in place,
// which is enough to prove the mechanism without a real router.
function initStubLinks(curtain) {
  document.querySelectorAll('a[data-stub]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      curtain.playRouteTransition(a.textContent.trim() || 'Pleurat Shala');
    });
  });
}

const TOOL_CHIPS = [
  { name: 'Claude' }, { name: 'Figma' }, { name: 'Cursor' }, { name: 'Supabase' },
  { name: 'Vercel' }, { name: 'OpenAI' }, { name: 'Meta' }, { name: 'Grok' },
  { name: 'GitHub' }, { name: 'Tailwind' },
];

function boot() {
  const curtain = initCurtain();
  initTheme();
  initNavSheet();
  initStubLinks(curtain);
  initMomentumScroll();
  initIoReveal();
  initCommuter();
  initConsole();
  initFocusTabs();
  initChartScene();
  initMosaicScrub();
  initBoardWalk(TOOL_CHIPS);

  // stagger-reveal call sites, from build-analysis.md item #2:
  //   Ledger (Teams grid): {from:.96, rise:12, start:.94, span:.36, overlap:.5}
  //   Console's tools grid (the small figma/cursor/claude tag pills below its canvas, per
  //   content/03-console.md — NOT the big #tools AI-logo grid, whose per-item opacity is a
  //   permanent "recency of use" style already settled at scrollY=0 in the manifest, so it
  //   is rendered statically instead, see css/style.css comment above .sv-tools):
  //   {from:.88, rise:18, start:.9, span:.5, overlap:.7}
  initStaggerReveal(document.getElementById('sv-board'), '.sv-card', { from: 0.96, rise: 12, start: 0.94, span: 0.36, overlap: 0.5 });
  initStaggerReveal(document.querySelector('.sv-cn-canvas .vars'), 'span', { from: 0.88, rise: 18, start: 0.9, span: 0.5, overlap: 0.7 });

  // Expose debug handles for Gate 5 (engine probes reacting to scroll), per the skill's
  // verification contract.
  window.__sv = { version: 'rebuild-1' };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
