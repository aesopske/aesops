# Extraction notes: CBK Number of Transactions (Payment Cards)

**Source**:
`https://www.centralbank.go.ke/national-payments-system/payment-cards/number-of-transactions/`
— a single "Number of Transactions" wpDataTables table (`table#table_1`,
`data-wpdatatable_id="67"`).

## What this dataset is

Monthly Kenyan payment card **transaction counts** (not card/machine counts — see below), back
to **July 2009**: `atm_cards`, `prepaid_cards`, `charge_cards`, `credit_cards`, `debit_cards`
(transactions per card type), `pos_machines` (POS transactions), and `total` — the sum of the
five card-type columns (POS transactions are reported separately and excluded from `total`).

This is the **companion dataset to `cbk_atms_cards_pos`** (same page family, same date range,
`table_id=66` vs `67`) — that one is counts of ATMs/cards/machines *in circulation*, this one is
counts of *transactions* made with them. Don't conflate the two even though the column names are
nearly identical.

## What was tried and why it worked immediately

Same shape as the other `serverSide:false` CBK tables: the entire dataset is already present in
the raw HTML `<tbody>`, so a plain `requests.get` returns the complete history in one response.

Confirmed live: 203 rows, monthly from **July 2009** through the most recent published month
(May 2026 at time of writing), 9 columns per row.

## Edge case: `atm_cards` (`ATMCards`) column is hidden in the UI but present in the DOM

The embedded config marks this column `"bVisible":false`, so it doesn't render in the on-page
table — but the `<td>` is still present in the raw HTML `<tbody>` for every row (verified: every
row has exactly 9 `<td>`s), so `parse.py` reads it the same as any other column. Every observed
value for this column is `0`.

## Edge case: one row has a non-integer value

`2010-03`'s `debit_cards` value is `6647688.16` — every other value in the table is a whole
number, but this one has a fractional component. `parse.py` parses every numeric field as
`float` (not `int`) specifically to avoid crashing on this row.

## Edge case: `total` doesn't reconcile for the earliest 5 months (Jul–Nov 2009)

From **December 2009 onward**, `total` reconciles exactly with
`atm_cards + prepaid_cards + charge_cards + credit_cards + debit_cards` (verified across every
row in that range). But the table's first 5 published months — July through November 2009 — do
**not** reconcile (e.g. July 2009: card-type sum is `6,823,813` but `total` is `7,295,404`, a
gap of `471,591` that doesn't match `pos_machines` either). This looks like a real quirk in
CBK's earliest published figures for this series, not a scraping/parsing bug — confirmed against
a raw curl of the page, independent of `parse.py`. `validate.py`'s reconciliation check
whitelists these five specific `(year, month)` keys
(`KNOWN_NON_RECONCILING_MONTHS`) and will still fail loudly on any other unexpected mismatch.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-card-transactions`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
