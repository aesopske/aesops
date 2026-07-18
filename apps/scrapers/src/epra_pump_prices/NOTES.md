# Extraction notes: EPRA Pump Prices

**Source**: `https://www.epra.go.ke/pump-prices` — a plain (non-wpDataTables) Drupal Views table
(`table#datatable`) on the Energy and Petroleum Regulatory Authority (EPRA) site. This is the
first non-CBK scraper in this repo.

## What this dataset is

Retail (pump) prices per litre for `super_pms`, `diesel_ago`, `kerosene_ik`, by `town`, for each
~monthly price review period (`period_from`-`period_to`). EPRA reviews and publishes new pump
prices roughly every month, effective the 15th of one month through the 14th of the next.

Confirmed live: 21 price-review periods (November 2024 → the period effective mid-June through
mid-July 2026 at time of writing), 223 towns per period, 4,683 rows total.

## Correction to the initial task framing: this table is *not* stale

The task that prompted this scraper stated the data "hasn't been updated from 14-01-2026" — but
a direct fetch showed the table's most recent period is `2026-06-15` to `2026-07-14`, i.e.
current as of "today" (2026-07-18) in this repo's working context. The `14-01-2026` date the
task referenced is the *end* of one specific period (`2025-12-15` to `2026-01-14`), not the
latest one — it's plausible the site had genuinely not updated past that point at some earlier
moment and has since resumed, or the date was simply misread from a mid-list row. Either way,
`scrape()` doesn't assume staleness or hardcode "the last period is X" anywhere — it always
reads and returns every period currently on the page, so this scraper self-corrects regardless
of which framing was accurate at any given point in time.

## What was tried and why it worked immediately

Unlike every CBK table scraped in this repo (all wpDataTables), this is a standard Drupal Views
HTML table with no client-side pagination framework — page size is uncapped in the raw response
(the full ~4,700-row `<tbody>` is embedded directly, ~5.9 MB of HTML for the table alone). A
plain `requests.get` on the page URL returns the complete dataset in one response; no
AJAX/API endpoint needed, and the fetch completes in well under 10 seconds despite the response
size.

## Edge case: two overlapping "start" dates for the same nominal cycle

`2026-04-15`→`2026-05-14` and `2026-04-16`→`2026-05-14` both appear as distinct periods (each
with a full 223-town row set) — EPRA apparently shifted the effective start date by one day for
that cycle (visible directly in the raw HTML, not a parsing artifact). `parse.py` treats these as
two genuinely distinct periods since the natural key is `(period_from, period_to, town)` and
both combinations are real, published rows — no special-casing needed.

## Why every run re-uploads full history, not just the new period

Same reasoning as the CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug epra-pump-prices`).

See `validate.py` for the full check suite, including a per-period town-count consistency check
(every period should cover the same 223 towns — a gap would mean a partial scrape or a partial
source publish).
