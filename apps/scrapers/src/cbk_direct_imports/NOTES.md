# Extraction notes: CBK Value of Direct Imports Per Commodities

**Source**: `https://www.centralbank.go.ke/value-direct-imports-per-commodities/` — the "Value
Direct Imports Per Commodities (Ksh Million)" wpDataTables table (`table#table_1`,
`data-wpdatatable_id="169"`).

## What this dataset is

Monthly Kenyan direct import values (Ksh Million) by broad SITC-style commodity category, back
to **August 1998**: `food_and_live_animals`, `beverages_and_tobacco`, `crude_materials` (the
source's full header is "Crude Materials Inedible except Fuels"), `mineral_fuels` ("Mineral
Fuels Lubricants and related Materials"), `animal_vegetable_oils` ("Animals and Vegetable Oils
and Fats"), `chemicals`, `manufactured_goods` ("Manufactured Goods Classified Chiefly by
Materials"), `machinery_transport` ("Machinery and Transport Equipment"), `other`, plus `total`.

## What was tried and why it worked immediately

Same shape as most other CBK tables: `"serverSide":false`, so the entire dataset is already
present in the raw HTML `<tbody>` and a plain `requests.get` returns the complete history in one
response — no AJAX endpoint needed.

Confirmed live: 332 rows, monthly from **August 1998** through the most recent published month
(March 2026 at time of writing), 12 columns per row. Zero duplicate `(year, month)` keys and
zero empty cells found across the full response.

## No known data-quality exceptions

`total` reconciles against the sum of the 9 commodity columns cleanly for **every single row** —
max observed delta is 3.0 (ordinary rounding), with no large-magnitude mismatches anywhere in
the table, similar to `cbk_rest_of_world_exports` and unlike `cbk_domestic_exports`/
`cbk_african_exports` (which each have a data-quality anomaly confined to specific months).
Verified by checking the full delta distribution across all 332 rows before writing
`validate.py`, not just spot-checking a few.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-direct-imports`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
