# Extraction notes: CBK Number of ATMs, ATM Cards & POS Machines

**Source**:
`https://www.centralbank.go.ke/national-payments-system/payment-cards/number-of-atms-atm-cards-pos-machines/`
— a single "Number of ATMs, ATM Cards, & POS Machines" wpDataTables table
(`table#table_1`, `data-wpdatatable_id="66"`).

## What this dataset is

Monthly Kenyan payment infrastructure counts, back to **July 2009**: `atms`, `pos_machines`
(count), plus cards in circulation broken out by type — `atm_cards`, `prepaid_cards`,
`charge_cards`, `credit_cards`, `debit_cards` — and `total_cards`, the sum of those five.

## What was tried and why it worked immediately

Same shape as `cbk_annual_gdp`/`cbk_foreign_trade`/`cbk_inflation`/`cbk_mobile_payments`: the
embedded config has `"serverSide":false`, so the entire dataset is already present in the raw
HTML `<tbody>` and the UI's `iDisplayLength: 10` pagination is purely a JS-side view over that
fully-loaded array. A plain `requests.get` on the page URL returns the complete history in one
response; no AJAX endpoint or SSP body is needed.

Confirmed live: 203 rows, monthly from **July 2009** through the most recent published month
(May 2026 at time of writing), 10 columns per row. Verified before writing any parsing code that
the raw table has **zero duplicate `(year, month)` rows** and that `total_cards` reconciles
exactly with the sum of the five card-type columns for every single row — so `parse.py`'s
natural-key dedup guard is purely defensive here (no known conflicts), and `validate.py` adds an
explicit reconciliation check to catch any future column misalignment.

## Edge case: `atm_cards` and `charge_cards` are frequently `0`

Both columns are legitimately `0` for many months (e.g. every row sampled from 2026 has
`atm_cards=0`) — this isn't a missing-value placeholder, it reflects those card types having
been phased out/not issued in Kenya during those periods, and `total_cards` correctly excludes
them when they're `0`. `check_non_negative` still applies (no field here is ever negative), but
`0` is a valid, expected value and isn't flagged as a null/missing case.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-atms-cards-pos`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
