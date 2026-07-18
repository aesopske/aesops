# Extraction notes: CBK Value of Direct Imports from Selected Rest of World Countries

**Source**:
`https://www.centralbank.go.ke/value-direct-imports-selected-rest-world-countries/` — the "Value
of Direct Imports from Selected Rest of World Countries (Kshs. Millions)" wpDataTables table
(`table#table_1`, `data-wpdatatable_id="21"`).

## What this dataset is

Monthly Kenyan direct import values (Ksh Million) from 10 named countries — `uk`, `usa`,
`germany`, `italy`, `uae`, `saudi_arabia` (source column `SARABIA`), `france`, `india`,
`south_africa` (source column `SAFRICA`), `japan` — plus `others` and `total`, back to
**September 1998**. Import-side companion to `cbk_rest_of_world_exports` (`table_id=21` vs
`24`); note the country lists differ (this one drops Belgium/Netherlands/Pakistan/Uganda/
Tanzania/Egypt in favor of Italy/UAE/Saudi Arabia/India/Japan) — don't assume the two tables
share a schema.

## What was tried and why it worked

Same shape as `cbk_forex`/`cbk_african_imports`: the embedded config has `"serverSide":true`
with an explicit `ajax.url`. A plain HTML GET only returns the page shell; the real data source
is the standard DataTables server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=21`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 339`, 14 columns per row.

Confirmed live: 339 rows, monthly from **September 1998** through the most recent published
month (January 2026 at time of writing). Zero duplicate `(year, month)` keys and zero empty
cells found across the full response.

## Edge case: every month of 1998 and 1999 has a `total` mismatch

`total` reconciles against the sum of the 10 country columns plus `others` within ordinary
rounding noise (max delta 3.0) for **every month from January 2000 onward**. Every single month
of **1998 and 1999** (24 months total) shows a real mismatch — deltas of 462 or larger,
confirmed directly against a raw curl of the AJAX endpoint, independent of `parse.py`. This
mirrors the pattern seen on `cbk_domestic_exports` (an entire year affected, not scattered
individual months), just over a two-year window instead of one. `validate.py`'s reconciliation
check whitelists all 24 `(year, month)` keys in 1998-1999 explicitly
(`KNOWN_NON_RECONCILING_MONTHS`) and will still fail loudly on any mismatch in any other year
beyond the 5-unit rounding tolerance.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-rest-of-world-imports`).

See `validate.py` for the checks that catch regressions of this kind.
