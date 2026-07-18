# Extraction notes: CBK Principal Exports (Volume, Value & Unit Prices)

**Source**: `https://www.centralbank.go.ke/principal-exports-volume-value-unit-prices/` — the
"Principal Exports: Volume, Value and Unit Prices (Ksh Million)" wpDataTables table
(`table#table_1`, `data-wpdatatable_id="27"`).

## What this dataset is

Monthly Kenyan principal export commodity statistics, back to **August 1998**, for three
commodity groups — coffee, tea, and horticulture — each with three columns: `volume_*`,
`value_*` (Ksh Million), and `average_*` (average unit price).

## What was tried and why it worked

The embedded config has `"serverSide":true` with an explicit `ajax.url` — same shape as
`cbk_forex`/`cbk_weighted_average_rates`/`cbk_dfcc`. A plain HTML GET only returns the page
shell; the real data source is the standard DataTables server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=27`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 332`, 11 columns per row
(`year, month, volume_coffee, value_coffee, average_coffee, volume_tea, value_tea, average_tea,
volume_hort, value_hort, average_hort`).

Confirmed live: 332 rows, monthly from **August 1998** through the most recent published month
(March 2026 at time of writing). Zero duplicate `(year, month)` keys and zero empty cells found
across the full response before writing any parsing code.

## Edge case: `average_*` is not simply `value_* / volume_*`

Spot-checking `average_coffee` against `value_coffee / volume_coffee` gives a ratio off by a
factor of ~1,000,000 (e.g. 2026-03: `value/volume ≈ 1.003`, but `average_coffee = 1,003,122.61`)
— consistent across every commodity and every row sampled. This is a **unit-scaling artifact**,
not a data error: `volume` and `value` are both in the table's stated units (Ksh Million for
value), but `average` (unit price) is reported in absolute Ksh per unit of volume, so the
implicit relationship is `average ≈ (value / volume) × 1,000,000`. `parse.py` does not attempt
to re-derive or validate `average` from `value`/`volume` — it's carried through as-published,
and `validate.py` doesn't add a reconciliation check for this relationship since the scaling
factor is inferred rather than documented anywhere machine-readable on the source page.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-principal-exports`).

See `validate.py` for the checks that catch regressions of this kind.
