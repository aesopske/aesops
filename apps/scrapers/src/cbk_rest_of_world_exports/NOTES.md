# Extraction notes: CBK Value of Exports to Selected Rest of World Countries

**Source**:
`https://www.centralbank.go.ke/value-exports-selected-rest-world-countries/` — the "Value of
Exports to Selected Rest of World Countries (Ksh Million)" wpDataTables table (`table#table_1`,
`data-wpdatatable_id="24"`).

## What this dataset is

Monthly Kenyan export values (Ksh Million) to 10 named countries — `uk`, `germany`, `usa`,
`netherlands`, `uganda`, `tanzania`, `pakistan`, `france`, `egypt`, `belgium` — plus `others`
and `total`, back to **September 1998**.

Same page family, table shape, and date range as `cbk_african_exports` (`table_id=24` vs `23`).
Note the country lists **overlap**: `uganda`, `tanzania`, and `egypt` appear as named columns on
*both* tables — CBK's "selected rest of world" list is evidently its own separately-curated top
export-destination list (by global ranking, not region), not a residual "everything not in
Africa" set, so it re-includes a handful of African countries that also rank among Kenya's top
overall trading partners. Don't assume these two tables are mutually exclusive or that summing
both gives a correct grand total without deduplicating the overlapping columns.

## What was tried and why it worked

Same shape as `cbk_forex`/`cbk_african_exports`: the embedded config has `"serverSide":true`
with an explicit `ajax.url`. A plain HTML GET only returns the page shell; the real data source
is the standard DataTables server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=24`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 339`, 14 columns per row.

Confirmed live: 339 rows, monthly from **September 1998** through the most recent published
month (February 2026 at time of writing). Zero duplicate `(year, month)` keys and zero empty
cells found across the full response.

## No known data-quality exceptions (unlike its sibling tables)

`total` reconciles against the sum of the 10 country columns plus `others` cleanly for **every
single row** — max observed delta is 3.0 (ordinary rounding), with no large-magnitude mismatches
anywhere in the table. This is notably cleaner than `cbk_african_exports` (2-month exception) and
`cbk_domestic_exports` (entire-2018 exception) — verified by checking the full delta
distribution across all 339 rows before writing `validate.py`, not just spot-checking a few.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-rest-of-world-exports`).

See `validate.py` for the checks that catch regressions of this kind.
