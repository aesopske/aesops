# Extraction notes: CBK Diaspora Remittances

**Source**: `https://www.centralbank.go.ke/diaspora-remittances/` — the "Diaspora Remittances"
wpDataTables table (`table#table_1`, `data-wpdatatable_id="189"`).

## What this dataset is

Monthly Kenyan diaspora remittance inflows (USD '000) by source region — `north_america`,
`europe`, `rest_of_world` — plus `total_usd_thousands`, back to **January 2004**.

## What was tried and why it worked immediately

Same shape as most other CBK tables: `"serverSide":false`, so the entire dataset is already
present in the raw HTML `<tbody>` and a plain `requests.get` returns the complete history in one
response — no AJAX endpoint needed.

Confirmed live: 270 rows, monthly from **January 2004** through the most recent published month
(June 2026 at time of writing), 6 columns per row, zero duplicate `(year, month)` keys, zero
empty cells.

## Edge case: the raw "Month" column is a numeric string, not a month name

Unlike every other CBK table scraped in this repo, the raw `Month` column here is a digit string
representing the month number — inconsistently zero-padded (`"01"`.."12"` in older rows,
`"1"`.."12"` with no leading zero in rows from partway through the table onward). `parse.py`
converts this to `int` (which handles both formats identically) and maps `1`-`12` to full month
names (`"January"`-`"December"`) to match the convention every other CBK scraper in this repo
uses for its `month` field, rather than keeping the raw numeric/inconsistently-formatted string.

## Edge case: `total` doesn't reconcile for months where the regional breakdown wasn't published

From **2004 through most of 2006** (plus two isolated later months: **2008-01** and **2010-12**),
`north_america`, `europe`, and `rest_of_world` are all `0.00` while `total_usd_thousands` is a
real, populated figure — CBK evidently didn't publish (or hasn't back-filled) the regional split
for those 38 rows, only the aggregate total. This isn't a parsing bug: verified directly against
a raw curl of the page. `check_total_reconciles` in `validate.py` treats "all three regions are
exactly `0.0` while total is `>0`" as an expected exception rather than hardcoding a list of
`(year, month)` keys, since the condition itself identifies every instance cleanly and would
also catch any future recurrence of the same publishing gap.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-diaspora-remittances`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
