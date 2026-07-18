# Extraction notes: CBK KEPSS/RTGS

**Source**: `https://www.centralbank.go.ke/national-payments-system/kepss-rtgs/` — the
"KEPSS/RTGS" wpDataTables table (`table#table_3`, `data-wpdatatable_id="68"`).

## What this dataset is

Monthly Kenyan Electronic Payment and Settlement System (KEPSS) real-time gross settlement
(RTGS) activity, back to **August 2005**: `volume` (transaction count) and
`value_ksh_millions` (transaction value, Ksh Millions).

## Edge case: the table's own DOM id is `table_3`, not `table_1`

Every other CBK page scraped in this repo so far uses `<table id="table_1">` as its
wpDataTables element ID. This page's table is `<table id="table_3">`
(`data-wpdatatable_id="68"`) — confirmed by grepping the raw HTML for `id="table_[0-9]*"` and
finding only `table_3` present (no `table_1`/`table_2` elsewhere on the page). `parse.py`'s
`TABLE_ID` constant is set to `"table_3"` accordingly; don't copy `"table_1"` from other CBK
scrapers here without checking each new page's actual DOM id first.

## What was tried and why it worked immediately

Same shape as most other CBK tables: `"serverSide":false`, so the entire dataset is already
present in the raw HTML `<tbody>` and a plain `requests.get` returns the complete history in one
response — no AJAX endpoint needed.

Confirmed live: 251 rows, monthly from **August 2005** through the most recent published month
(May 2026 at time of writing), 4 columns per row.

## Edge case: a genuine conflicting duplicate (year, month)

Same situation as `cbk_weighted_average_rates` and `cbk_dfcc`: `2016-01` appears twice in the
raw 251-row response with **different values**
(`('328,444', '2363214')` vs `('226,495', '2171499')`) — no row-ID, timestamp, or other field to
determine which is the correction. No other duplicate keys and no empty cells were found across
all 251 rows.

`parse.py` dedupes on the **full row** (all four fields), which keeps both sides of this genuine
conflict rather than guessing which value is correct. `validate.py`'s uniqueness check allows
this one specific `(year, month)` key (`KNOWN_CONFLICTING_KEY = (2016, "January")`) to appear
twice and will still fail loudly on any *other* unexpected duplicate.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-kepss-rtgs`).

See `validate.py` for the checks that catch regressions of this kind.
