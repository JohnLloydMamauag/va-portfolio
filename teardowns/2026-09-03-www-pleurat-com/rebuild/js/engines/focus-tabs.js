// Focus/Tracks section — Previous/Next tab paging.
// content/04-focus-tracks.md: only track 1 of 3 was ever captured (Previous button was
// disabled="" at capture time, confirming it's first). Tracks 2/3 titles+copy were fetched
// client-side from Sanity and the response body wasn't saved by the teardown's runtime
// pass — an honest gap, not invented CMS content (see build-analysis.md Gotcha list).
const TRACKS = [
  { badge: '10+ YEARS', title: 'Product Design', desc: 'Most aspects of design and business, end-to-end, while shipping a product.' },
  { badge: '—', title: 'Track 2 — not captured', desc: 'This track’s title/description were not recovered by the teardown (Sanity response body wasn’t saved). Placeholder, not invented CMS content.' },
  { badge: '—', title: 'Track 3 — not captured', desc: 'This track’s title/description were not recovered by the teardown (Sanity response body wasn’t saved). Placeholder, not invented CMS content.' },
];

export function initFocusTabs() {
  const reading = document.getElementById('sv-reading');
  const prev = document.getElementById('sv-track-prev');
  const next = document.getElementById('sv-track-next');
  const ixEl = document.getElementById('sv-track-ix');
  if (!reading) return () => {};
  let i = 0;
  const render = () => {
    const t = TRACKS[i];
    reading.innerHTML = `<div class="sv-track" data-track="${i}"><span class="badge">${t.badge}</span><h3>${t.title}</h3><p>${t.desc}</p></div>`;
    reading.querySelector('.sv-track').classList.add('sv-fade', 'is-in');
    prev.disabled = i === 0;
    next.disabled = i === TRACKS.length - 1;
    ixEl.textContent = `${i + 1} / ${TRACKS.length}`;
  };
  prev.addEventListener('click', () => { if (i > 0) { i--; render(); } });
  next.addEventListener('click', () => { if (i < TRACKS.length - 1) { i++; render(); } });
  render();
  return () => {};
}
