# Extraction notes: CBK Inflation Rates

**Source**: `https://www.centralbank.go.ke/inflation-rates/` — a single "Inflation Rates"
wpDataTables table (`table#table_1`, `data-wpdatatable_id="172"`).

## Cadence: this is monthly data, not yearly

The page's name suggests annual figures, but the table is actually monthly: `(year, month,
annual_average_inflation, twelve_month_inflation)`, published every month back to **January
2005**. `annual_average_inflation` is a trailing 12-month moving average (KNBS's headline
"annual average inflation" measure), and `twelve_month_inflation` is the year-on-year rate for
that specific month — both change every month, so the scraper is scheduled monthly like
`cbk_foreign_trade`, not yearly like `cbk_annual_gdp`.

## What was tried and why it worked immediately

Same shape as `cbk_annual_gdp`/`cbk_foreign_trade`: the embedded config has
`"serverSide":false`, so the entire dataset is already present in the raw HTML `<tbody>` and the
UI's `iDisplayLength: 10` pagination is purely a JS-side view over that fully-loaded array. A
plain `requests.get` on the page URL returns the complete history in one response; no AJAX
endpoint or SSP body is needed (unlike `cbk_forex`).

Confirmed live: 259 raw rows (258 unique after dedup — see below), monthly from **January 2005**
through the most recent published month (June 2026 at time of writing), 4 columns per row:
`Year`, `Month`, `Annual Average Inflation`, `12-Month Inflation` (both %). Spot-checked the
first, last, and duplicated rows directly against a raw curl of the page, independent of
`parse.py`.

## Edge cases found

- **`2019-04` is published twice** in the raw source, both rows with identical values
  (`annual_average_inflation=4.91`, `twelve_month_inflation=6.58`) — a harmless exact duplicate,
  not a data conflict. `parse.py` dedupes on the natural key `(year, month)` but raises
  `ValueError` if a repeated key ever disagrees on value (mirrors the guard pattern in
  `cbk_forex`/`cbk_foreign_trade`), so a future *conflicting* duplicate would fail loudly rather
  than silently pick one.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always fetches and returns every row
currently on the page, and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-inflation`).

See `validate.py` for the full check suite — spot-checked values are independently verified
against a raw curl of the page, not the parser's own output.
