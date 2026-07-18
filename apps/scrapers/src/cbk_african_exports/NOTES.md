# Extraction notes: CBK Value of Exports to Selected African Countries

**Source**: `https://www.centralbank.go.ke/value-exports-selected-african-countries/` — the
"Value of Exports to Selected African Countries (Ksh Million)" wpDataTables table
(`table#table_1`, `data-wpdatatable_id="23"`).

## What this dataset is

Monthly Kenyan export values (Ksh Million) to 10 named African countries — `uganda`,
`tanzania`, `zambia`, `egypt`, `rwanda`, `zimbabwe`, `ethiopia`, `somalia`, `south_africa`
(source column `SAFRICA`), `drc` — plus `other` (everything else) and `total`, back to
**September 1998**.

## What was tried and why it worked

Same shape as `cbk_forex`/`cbk_principal_exports`/`cbk_domestic_exports`: the embedded config
has `"serverSide":true` with an explicit `ajax.url`. A plain HTML GET only returns the page
shell; the real data source is the standard DataTables server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=23`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 339`, 14 columns per row.

Confirmed live: 339 rows, monthly from **September 1998** through the most recent published
month (February 2026 at time of writing). Zero duplicate `(year, month)` keys and zero empty
cells found across the full response.

## Edge case: `total` doesn't reconcile for exactly two months (Nov/Dec 2018)

`total` reconciles against the sum of the 10 country columns plus `other` within ordinary
rounding noise (max delta 3.0, occurring at a handful of scattered months across the table's
history) for **every month except November and December 2018**, which are off by ~495 and ~497
respectively — confirmed directly against a raw curl of the AJAX endpoint, independent of
`parse.py`. Notably, the *rest* of 2018 (Jan-Oct) reconciles fine, unlike `cbk_domestic_exports`
where the entire year 2018 was affected — this is a narrower, two-month-only anomaly on a
different underlying table, not the same root cause. `validate.py`'s reconciliation check
whitelists these two specific `(year, month)` keys (`KNOWN_NON_RECONCILING_MONTHS`) and will
still fail loudly on any other unexpected mismatch beyond the 5-unit rounding tolerance.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-african-exports`).

See `validate.py` for the checks that catch regressions of this kind.
