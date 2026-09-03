> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 05 — Chart / "By the numbers"

EXTRACTED from `source/rendered.html:2792-2861` — `<section class="sv-chart-sec">`. This is the scroll-pinned diagram scene both prior teardown passes flagged (`notes-runtime.md` §8: `section.sv-chart-sec`, scrollHeight 2385px; `notes-bundles.md`: `sv-b-wire/-node/-lbl/-line/-path` build-on-diagram keyframes).

Pin badge: `By the numbers`

## Heading

> Ten years,
> **by the numbers.**

## Sub-copy + CTA

> Products shipped, teams joined, systems maintained — the decade counted rather than described.

CTA: **Read the full profile →** — `href="/about"`

## Stat bars (`div.sv-chart`)

Four animated count-up bars. At capture time all four still read `0+` (transition-delay-staggered 0/140/280/420ms, count-up hadn't finished/fired yet in the static snapshot) — **the real target numbers are not recoverable from this capture** (not in the rendered DOM, not in the network log, not in the static JS bundle since they're CMS-driven `settings.stats`).

| Label (verbatim) | Value captured |
|---|---|
| Years designing | 0+ *(placeholder, real value unknown)* |
| Websites designed | 0+ *(placeholder, real value unknown)* |
| Products shipped | 0+ *(placeholder, real value unknown)* |
| Industries workd | 0+ *(placeholder, real value unknown)* |

**Note:** "Industries **workd**" is a typo present in the live site's own copy (missing "e" — should read "worked"). EXTRACTED verbatim, not a transcription error on this pass — flagging rather than silently correcting, per instructions to reproduce source copy as-is.

## Assets used in this section

None — chart bars are CSS/DOM only, no images.
