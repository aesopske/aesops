# Extraction notes: CBK Central Bank Rates

**Source**: `https://www.centralbank.go.ke/central-bank-rates/` — the "Central Bank Rates (%)"
wpDataTables table (`table#table_1`, `data-wpdatatable_id="148"`).

## What this dataset is

Monthly Kenyan money market rates (%): `repo`, `reverse_repo`, `interbank_rate`,
`tbill_91_day`/`tbill_182_day`/`tbill_364_day` (Treasury bill rates), `cash_reserve_requirement`,
and `central_bank_rate` (CBR).

## Important: this table has not been updated since July 2016

Confirmed live: **301 rows, monthly from July 1991 through July 2016 — and no later.** This is
notably different from every other CBK table scraped in this repo, all of which extend to the
current month. CBK appears to have stopped publishing to this specific table years ago (possibly
superseded by a different page/table for current CBR data — not investigated further here, out
of scope for this scraper). `validate.py`'s `EXPECTED_RECORD_COUNT_RANGE` is deliberately tight
(290–400, not a generous open-ended range) so that if the source ever resumes publishing here, a
sudden jump in record count fails loudly and prompts a manual look rather than being silently
absorbed.

The scraper still runs monthly like the others for consistency (the workflow is a no-op re-upload
of the same historical data until/unless the source changes) — this is a deliberate simplicity
tradeoff, not a signal that the schedule is expected to produce new rows.

## What was tried and why it worked immediately

Same shape as most other CBK tables: `"serverSide":false`, so the entire dataset is already
present in the raw HTML `<tbody>` and a plain `requests.get` returns the complete history in one
response — no AJAX endpoint needed. Zero duplicate `(year, month)` keys found.

## Edge case: missing values use two different markers, and 0.00 is a real reported value

Unlike every other CBK table scraped so far (which have few or no missing values), this table's
early history is sparse: individual fields are published as either an **empty cell** or a
literal **`"-"`** placeholder — both mean "not reported for this month". `parse.py` treats both
as `None`, distinct from `0.00`, which is a genuine reported value in many rows (particularly for
`tbill_364_day`, which didn't exist as an instrument for much of this table's early history and
is `0.00` rather than blank in those months — verified as a real published `0` in the raw HTML,
not a missing-value stand-in). No row has *every* field missing.

Since real nulls are expected and pervasive here, `validate.py`'s null-audit check only requires
`year`/`month` to be non-null — a full "no unexplained nulls" check like the other CBK scrapers
use would fail on legitimate source-reported missing data throughout this table's history.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-central-bank-rates`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
