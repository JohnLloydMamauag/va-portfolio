> REFERENCE-ONLY: original site copy. Rewrite for any real build — do not ship verbatim.

# 04 — Focus / Tracks

EXTRACTED from `source/rendered.html:2545-2791` — `<section id="focus" class="sv-inst-sec" data-badge="Tracks">`.

This section was not in the guessed section list going in — it sits between the Console demo and the "By the numbers" chart section, and wasn't separately identified by either prior teardown pass (the runtime pass's sticky-scene scan only flagged the chart and mosaic tracks as scroll-pinned; this one is also `position:sticky`-pinned per its `sv-inst-pin` wrapper class but scrolled past too quickly/wasn't in the heuristic's size threshold).

## Heading

> Primarily **focused on**

Sub-copy:
> Ten years of shipping, settled into three tracks that sharpen each other every day.

## Content — tabbed/paginated track viewer

An SVG "artboard assembling itself" illustration (`role="img"`, `aria-label="Product design — an artboard assembling itself"`) sits beside a text panel (`div.sv-reading`) that shows **one track at a time**, with Previous/Next buttons (`div.sv-rnav`) to page through them. Sub-copy confirms there are **three tracks total**, but only the currently-active one is present in the static DOM:

| Field | Value (captured) |
|---|---|
| Track title | Product Design |
| Duration badge | 10+ YEARS |
| Description | Most aspects of design and business, end-to-end, while shipping a product. |

**Gap:** the other two tracks' titles/descriptions were not captured — this content is fetched at runtime from the Sanity CMS query (`focus` array: `{yr, unit, title, desc, iso}`, visible in `source/network-log.json`'s captured GROQ query string) but the response *body* wasn't saved by the runtime pass, and the DOM only ever renders the active tab (`Previous track` button was `disabled=""` at capture, confirming this was the *first* of the three — so "Product Design" is track 1 of 3, the other two are unknown from this capture).

## Assets used in this section

None — the artboard illustration is inline SVG.
