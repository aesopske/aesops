# Extraction notes: CBK Annual GDP

**Source**: `https://www.centralbank.go.ke/annual-gdp/` — a single "Annual GDP" wpDataTables
table (`table#table_1`, `data-wpdatatable_id="149"`).

## What was tried and why it worked immediately

Unlike `cbk_forex` (a wpDataTables widget that renders client-side via a DataTables
server-side-processing AJAX call), this table's embedded config has `"serverSide":false` — the
`<tbody>` already contains every row in the raw HTML response. A plain `requests.get` on the
page URL is sufficient; no AJAX endpoint, table ID param, or SSP POST body is needed.

Confirmed live: 26 rows, years 2000–2025, four columns per row: `Year`, `Nominal GDP prices
(Ksh Million)`, `Annual GDP growth (%)`, `Real GDP prices (Ksh Million)`. Row values were
cross-checked against a raw curl of the page independent of `parse.py`.

## Why every run re-uploads full history, not just the new year

Same reasoning as `cbk_forex` (see its `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every
row currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-annual-gdp`).

## Edge cases / assumptions

- The table has no pagination or "show all" toggle to worry about — all rows are present in a
  single response by construction (`serverSide:false`).
- `parse.py` dedupes on the natural key `year`, raising `ValueError` on a genuine conflicting
  duplicate rather than silently picking one — no duplicate years have been observed on this
  table, but the guard mirrors the pattern `cbk_forex/parse.py` uses for its `(date, currency)`
  key in case CBK ever republishes a revised/duplicate row.
- CBK typically revises the most recent 1-2 years' figures as more complete data comes in
  (visible if you diff consecutive scrapes), and occasionally back-revises older years too —
  this is expected and is exactly why the scraper re-fetches and re-uploads the full table each
  run rather than only appending new years.

See `validate.py` for the checks that catch regressions of this kind — spot-checked values are
independently verified against a raw curl of the page, not the parser's own output.
