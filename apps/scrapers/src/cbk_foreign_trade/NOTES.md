# Extraction notes: CBK Foreign Trade Summary

**Source**: `https://www.centralbank.go.ke/foreign-trade-summary/` — a single "Foreign Trade
Summary (Ksh Million)" wpDataTables table (`table#table_1`, `data-wpdatatable_id="153"`).

## What was tried and why it worked immediately

Same shape as `cbk_annual_gdp`: the embedded config has `"serverSide":false`, meaning this is a
client-side DataTable — the entire dataset is already present in the raw HTML `<tbody>`, and the
UI's `iDisplayLength: 10` pagination is purely a JS-side view over that fully-loaded array, not a
query limiter. A plain `requests.get` on the page URL returns the complete history in one
response; no AJAX endpoint or SSP body is needed (unlike `cbk_forex`).

Confirmed live: 330 rows, monthly from **August 1998** through the most recent published month
(March 2026 at time of writing), 9 columns per row: `Year`, `Month`, `Commercial Imports`,
`Government Imports`, `Total` (imports), `Domestic FOB`, `Re-Exports`, `Total FOB` (exports),
`Trade Balance` — all in Ksh Million. Spot-checked the first and last rows directly against a
raw curl of the page, independent of `parse.py`.

Explicitly re-verified that pagination does not truncate the response before writing any code:
the last parsed row is `1998 / August`, matching the page's own displayed history start, so no
rows are lost to lazy-loading.

## Column semantics / naming

The source's raw column names (`Commercial_Imports`, `Total`, `Domestic_FOB`, `Total_FOB`, etc.,
visible in the embedded `columnDefs`) are ambiguous once flattened into a table with other
scrapers, so `parse.py` renames them for clarity: `total` → `total_imports` (Commercial +
Government imports) and `Total_FOB` → `total_exports_fob` (Domestic FOB + Re-Exports exports).
`trade_balance` = `total_exports_fob - total_imports` and is negative whenever imports exceed
exports (true for every row observed).

## Why every run re-uploads full history, not just the new month

Same reasoning as `cbk_forex`/`cbk_annual_gdp` (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-foreign-trade`).

## Edge cases / assumptions

- `parse.py` dedupes on the natural key `(year, month)`, raising `ValueError` on a genuine
  conflicting duplicate — mirrors the guard pattern in `cbk_forex`/`cbk_annual_gdp`; no
  duplicates observed on this table.
- `trade_balance` is negative for every observed row (Kenya has run a persistent trade deficit
  since at least 1998) — `_parse_float` handles the leading `-` sign natively via `float()`.
- `validate.py` adds a stronger check than the other two CBK scrapers: since `total_imports`,
  `total_exports_fob`, and `trade_balance` are each arithmetic sums/differences of the other
  columns in the same row, `check_totals_reconcile` verifies those relationships hold (within
  floating-point rounding) — a column shifting out of alignment during parsing would show up as
  a component mismatch even if every individual value still parsed as a valid float.
- This table only has 330 rows total (vs. `cbk_forex`'s 13k+), all fully embedded in a single
  HTML response — no pagination/AJAX handling was needed at any point.

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
