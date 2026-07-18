# Extraction notes: CBK Mobile Payments

**Source**: `https://www.centralbank.go.ke/national-payments-system/mobile-payments/` — a single
"Mobile Payments" wpDataTables table (`table#table_1`, `data-wpdatatable_id="69"`).

## What this dataset is

Monthly Kenyan mobile money (mobile payments) usage statistics, back to **March 2007** (the
month M-Pesa launched): `active_agents` (count), `registered_accounts_millions` (total
registered mobile money accounts, millions), `agent_cash_in_out_volume_million` (total agent
cash-in/cash-out transaction volume, millions), and `agent_cash_in_out_value_ksh_billions`
(total agent cash-in/cash-out transaction value, Ksh billions).

## What was tried and why it worked immediately

Same shape as `cbk_annual_gdp`/`cbk_foreign_trade`/`cbk_inflation`: the embedded config has
`"serverSide":false`, so the entire dataset is already present in the raw HTML `<tbody>` and the
UI's `iDisplayLength: 10` pagination is purely a JS-side view over that fully-loaded array. A
plain `requests.get` on the page URL returns the complete history in one response; no AJAX
endpoint or SSP body is needed (unlike `cbk_forex`/`cbk_weighted_average_rates`).

Confirmed live: 231 rows, monthly from **March 2007** through the most recent published month
(May 2026 at time of writing), 6 columns per row. Unlike every other CBK scraper in this repo,
this table's raw HTML had **zero duplicate `(year, month)` rows and zero empty cells** —
verified by scanning the full raw table before writing `parse.py`, so the natural-key dedup
guard here is purely defensive (mirrors the pattern used elsewhere) rather than covering a known
edge case.

## Column renaming

The source's raw column headers are verbose UI labels (`Active Agents`, `Total Registered
Mobile Money Accounts (Millions)`, `Total Agent Cash in Cash Out (Volume Million)`, `Total Agent
Cash in Cash Out (Value KSh billions)`) — `parse.py` renames them to
`active_agents`/`registered_accounts_millions`/`agent_cash_in_out_volume_million`/
`agent_cash_in_out_value_ksh_billions` for a stable, code-friendly schema. Units are preserved
in the field names since the two "Total Agent Cash in Cash Out" columns differ only by
volume-vs-value and Millions-vs-billions.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-mobile-payments`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output. `check_non_negative` is specific to
this dataset: every metric here is a cumulative usage stat with no legitimate negative value
(unlike `cbk_foreign_trade`'s trade balance or the possibility of rate revisions elsewhere).
