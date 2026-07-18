# Extraction notes: CBK Value of Transactions (Payment Cards, Ksh Millions)

**Source**:
`https://www.centralbank.go.ke/national-payments-system/payment-cards/value-of-transactions-ksh-millions/`
— a single "Value of Transactions (Kshs. Millions)" wpDataTables table (`table#table_1`,
`data-wpdatatable_id="65"`).

## What this dataset is

Monthly Kenyan payment card **transaction values** (Ksh Millions — not counts, see below), back
to **July 2009**: `atm_cards_ksh_millions`, `prepaid_cards_ksh_millions`,
`charge_cards_ksh_millions`, `credit_cards_ksh_millions`, `debit_cards_ksh_millions` (value per
card type), `pos_machines_ksh_millions` (POS value), and `total_ksh_millions` — the sum of the
five card-type columns (POS value is reported separately and excluded from `total`).

This is the **companion dataset to `cbk_card_transactions`** (same page family, same table
shape, same date range, `table_id=65` vs `67`) — that one is transaction *counts*, this one is
transaction *values*. Don't conflate the two even though the column names and structure are
nearly identical.

## What was tried and why it worked immediately

Same shape as the other `serverSide:false` CBK tables: the entire dataset is already present in
the raw HTML `<tbody>`, so a plain `requests.get` returns the complete history in one response.

Confirmed live: 203 rows, monthly from **July 2009** through the most recent published month
(May 2026 at time of writing), 9 columns per row, zero duplicate `(year, month)` keys, zero
empty cells.

## Edge case: `atm_cards` (`ATM_Cards`) column is hidden in the UI but present in the DOM

Same as `cbk_card_transactions`: the embedded config marks this column `"bVisible":false`, so
it doesn't render on-page, but the `<td>` is still present in the raw HTML for every row. Every
observed value for this column is `0`.

## Edge case: fractional Ksh-Millions values are common (not a parsing anomaly)

Unlike `cbk_card_transactions` (where only one row had a non-integer value), fractional values
are routine here — e.g. `prepaid_cards_ksh_millions` for 2009 is `66.7787`, `62.2747`, etc.
`parse.py` parses every numeric field as `float`.

## Edge case: `total` doesn't reconcile for a handful of rows

From **November 2009 onward**, `total_ksh_millions` reconciles against
`atm_cards + prepaid_cards + charge_cards + credit_cards + debit_cards` within ordinary rounding
noise (deltas up to ~1.2 Ksh Millions across the whole post-2009 dataset — `validate.py` uses a
1.5 tolerance to absorb this). Two exceptions:

- **July–October 2009** (4 months): large mismatches in the thousands of Ksh Millions (e.g. July
  2009: card-type sum is `24,398.98` but `total` is `31,838.00`) — mirrors the same kind of
  discrepancy found in the companion `cbk_card_transactions` dataset for its first 5 months,
  though here the non-reconciling window is one month shorter (through October, not November).
- **September 2023**: an isolated mismatch of `60` (card-type sum `52,123.00` vs `total`
  `52,183.00`) with no similar issue in adjacent months — looks like a genuine one-off data
  entry quirk on CBK's side, confirmed against a raw curl of the page.

`validate.py`'s reconciliation check whitelists these five specific `(year, month)` keys
(`KNOWN_NON_RECONCILING_MONTHS`) and will still fail loudly on any other unexpected mismatch
beyond the 1.5 rounding tolerance.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-card-transaction-values`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
