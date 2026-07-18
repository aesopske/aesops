# Extraction notes: CBK Value of Selected Domestic Exports

**Source**: `https://www.centralbank.go.ke/value-selected-domestic-exports/` — the "Value of
Selected Domestic Exports (Ksh Million)" wpDataTables table (`table#table_1`,
`data-wpdatatable_id="26"`).

## What this dataset is

Monthly Kenyan domestic export values (Ksh Million) by commodity, back to **August 1998**:
`coffee`, `tea`, `petroleum`, `chemicals`, `fish`, `horticulture`, `cement`, `other`, plus
`total` — the sum of the eight commodity columns. Same page family and date range as
`cbk_principal_exports` (`table_id=26` vs `27`) — that one covers volume/value/unit-price for
just coffee/tea/horticulture; this one covers value only, but across all commodity categories.

## What was tried and why it worked

Same shape as `cbk_forex`/`cbk_principal_exports`: the embedded config has `"serverSide":true`
with an explicit `ajax.url`. A plain HTML GET only returns the page shell; the real data source
is the standard DataTables server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=26`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 332`, 11 columns per row.

Confirmed live: 332 rows, monthly from **August 1998** through the most recent published month
(March 2026 at time of writing). Zero duplicate `(year, month)` keys and zero empty cells found
across the full response.

## Edge case: every month of 2018 has a `total` mismatch — no other year does

`total` reconciles against the sum of the 8 commodity columns within ordinary rounding noise
(max delta 1.0, at 2014-12) for **every year except 2018**. Every single month of 2018 shows
*some* discrepancy — from negligible (January: 0.01) to large (March: 5,127.95) — confirmed
directly against a raw curl of the AJAX endpoint, independent of `parse.py`. There's no clean
characterizing condition the way there is for, say, `cbk_diaspora_remittances`'s "all regions
are exactly 0" rule — this just looks like 2018 was a genuinely bad year for this table's
internal consistency on CBK's side. `validate.py`'s reconciliation check whitelists all 12
months of 2018 explicitly (`KNOWN_NON_RECONCILING_MONTHS`) rather than trying to infer a
detection rule, and will still fail loudly on any mismatch in any other year beyond the 1.5
tolerance.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-domestic-exports`).

See `validate.py` for the checks that catch regressions of this kind.
