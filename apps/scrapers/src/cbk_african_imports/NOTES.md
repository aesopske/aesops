# Extraction notes: CBK Value of Direct Imports from Selected African Countries

**Source**:
`https://www.centralbank.go.ke/value-direct-imports-selected-african-countries/` — the "Value of
Direct Imports from Selected African Countries (Ksh. Million)" wpDataTables table
(`table#table_1`, `data-wpdatatable_id="22"`).

## What this dataset is

Monthly Kenyan direct import values (Ksh Million) from 6 named African countries — `uganda`,
`tanzania`, `zambia`, `egypt`, `south_africa` (source column `SAFRICA`), `zimbabwe` — plus
`other` and `total`, back to **September 1998**. Companion (import side) to `cbk_african_exports`
(export side) — note this table's country list is *smaller* than the export table's (6 named
countries here vs. 10 there, missing e.g. Rwanda, Ethiopia, Somalia, DRC) — the two tables are
not symmetric, so don't assume matching columns.

## What was tried and why it worked

Same shape as `cbk_forex`/`cbk_african_exports`: the embedded config has `"serverSide":true`
with an explicit `ajax.url`. A plain HTML GET only returns the page shell; the real data source
is the standard DataTables server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=22`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 339`, 10 columns per row.

Confirmed live: 339 rows, monthly from **September 1998** through the most recent published
month (March 2026 at time of writing). Zero duplicate `(year, month)` keys and zero empty cells
found across the full response.

## Edge case: `total` doesn't reconcile for exactly one month (January 2002)

`total` reconciles against the sum of the 6 country columns plus `other` within ordinary
rounding noise (max delta 2.0) for **every month except January 2002**, which is off by 23
(country-column sum is 2137, published total is 2114) — confirmed directly against a raw curl of
the AJAX endpoint, independent of `parse.py`. `validate.py`'s reconciliation check whitelists
this one specific `(year, month)` key (`KNOWN_NON_RECONCILING_MONTHS`) and will still fail loudly
on any other unexpected mismatch beyond the 5-unit rounding tolerance.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-african-imports`).

See `validate.py` for the checks that catch regressions of this kind.
