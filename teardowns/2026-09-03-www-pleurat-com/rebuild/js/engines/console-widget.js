// Engine #9 — "Console" playable fake terminal.
// SIMPLIFIED reimplementation of Console-CyBRxdTz.js:780-1159 (job sidebar, typed CLI log,
// mini command parser) against the same DOM/copy inventory documented in
// content/03-console.md. The typed-log ladder timing (130*(i+1)ms/line) is ported verbatim;
// the SVG diagram/chat pane are static markup (see index.html), not re-derived from the
// bundle's job-scene data (never fully fetched for job 2-4 content).
// The freehand "ink" annotation layer (E(), Console-CyBRxdTz.js:81-139) is no longer dropped
// — it now lives in ./console-ink.js and is wired up below, wrapping `.sv-cn-canvas` (this
// rebuild's equivalent of the real E()'s `.sv-cn-bench` wrap target).
import { initConsoleInk } from './console-ink.js';

const LINES = [
  '· the portfolio — type `help`, or press a key below',
  '❯ open workspace',
  '· opening the workspace',
  '· ↳ Ask for it, draw it, ship it.',
  '· restoring the board — notes, shapes, what is open',
  '✓ workspace live — it carries on without you',
];
const LINE_MS = 130; // per notes-bundles.md ladder: 130*(i+1)ms/line

export function initConsole() {
  const log = document.getElementById('sv-cn-log');
  const input = document.getElementById('sv-cn-input');
  const form = document.getElementById('sv-cn-prompt');
  const jobs = document.getElementById('sv-cn-jobs');
  const progress = document.getElementById('sv-cn-progress');
  if (!log) return () => {};

  let opened = 1;
  const typeLog = (lines) => {
    log.textContent = '';
    lines.forEach((line, i) => {
      window.setTimeout(() => {
        const div = document.createElement('div');
        div.textContent = line;
        if (line.startsWith('✓')) div.className = 'ok';
        log.appendChild(div);
        log.scrollTop = log.scrollHeight;
      }, LINE_MS * (i + 1));
    });
  };
  typeLog(LINES);

  jobs.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    jobs.querySelectorAll('li').forEach((x) => x.classList.remove('is-sel'));
    li.classList.add('is-sel', 'is-built');
    opened = new Set([...jobs.querySelectorAll('li.is-built')].map((x) => x.dataset.job)).size;
    progress.textContent = `${opened} / 4 opened`;
    typeLog([`· the portfolio — type \`help\`, or press a key below`, `❯ open ${li.querySelector('.t').textContent.toLowerCase()}`, `· opening ${li.querySelector('.t').textContent.toLowerCase()}`]);
  });

  const runCmd = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const echo = document.createElement('div'); echo.textContent = `❯ ${raw}`; log.appendChild(echo);
    let out = 'unknown command — try `help`';
    if (cmd === 'help') out = 'commands: open <name>, list, tags, next, clear, help';
    else if (cmd === 'list') out = [...jobs.querySelectorAll('.t')].map((t) => t.textContent).join(', ');
    else if (cmd === 'tags') out = 'figma · cursor · claude · live · never finished';
    else if (cmd === 'clear') { log.textContent = ''; return; }
    else if (cmd === 'next' || cmd.startsWith('open')) {
      const items = [...jobs.querySelectorAll('li')];
      const cur = items.findIndex((x) => x.classList.contains('is-sel'));
      const nextEl = items[(cur + 1) % items.length];
      nextEl.click();
      return;
    }
    const res = document.createElement('div'); res.textContent = `· ${out}`; log.appendChild(res);
    log.scrollTop = log.scrollHeight;
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); runCmd(input.value); input.value = ''; });
  form.querySelectorAll('[data-cmd]').forEach((btn) => btn.addEventListener('click', () => runCmd(btn.dataset.cmd)));

  const disposeInk = initConsoleInk(document.querySelector('.sv-cn-canvas'));

  return () => { disposeInk(); };
}
