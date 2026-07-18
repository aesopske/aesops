# Extraction notes: CBK Cheques & EFTs

**Source**:
`https://www.centralbank.go.ke/national-payments-system/automated-clearing-house/cheques-efts/`
— a single "Cheques & EFTs" wpDataTables table (`table#table_1`, `data-wpdatatable_id="137"`).

## What this dataset is

Monthly Kenyan automated clearing house (ACH) activity, back to **October 2007**:
`credit_efts_volume`/`credit_efts_value_ksh_billions` (electronic funds transfer credits) and
`debit_cheques_volume`/`debit_cheques_value_ksh_billions` (cheque debits). The page groups
"Credit" with EFTs and "Debit" with cheques specifically because of how the clearing house
settles each instrument type, not because EFTs can't be debits in general — the column labels
(`Credit (Efts) Volumes`, `Debit (Cheques) Volumes`, etc.) are exactly what CBK publishes.

## What was tried and why it worked immediately

Same shape as `cbk_annual_gdp`/`cbk_foreign_trade`/`cbk_inflation`/`cbk_mobile_payments`/
`cbk_atms_cards_pos`: the embedded config has `"serverSide":false`, so the entire dataset is
already present in the raw HTML `<tbody>` and the UI's `iDisplayLength: 10` pagination is purely
a JS-side view over that fully-loaded array. A plain `requests.get` on the page URL returns the
complete history in one response; no AJAX endpoint or SSP body is needed.

Confirmed live: 227 rows, monthly from **October 2007** through the most recent published month
(May 2026 at time of writing), 6 columns per row. Verified before writing any parsing code that
the raw table has **zero duplicate `(year, month)` rows and zero empty cells**.

## Edge case: inconsistent thousands-separator formatting

Volume columns are comma-formatted in older rows (e.g. `"365,145"` for 2007) but plain digits in
recent rows (e.g. `"1358127"` for 2026) — `_parse_int`/`_parse_float` strip commas
unconditionally so both formats parse identically; this isn't something `parse.py` needs to
branch on.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-cheques-efts`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
