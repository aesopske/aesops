# Extraction notes: CBK daily indicative forex rates

**Source**: `https://www.centralbank.go.ke/forex/` — the "Daily KES Exchange Rates" tab. There's
a second tab, "Foreign Exchange Bureau Rates", which is a different dataset (bureau, not
indicative, rates — a chronological archive of dated PDFs) and out of scope for this scraper.

## What was tried and why it didn't apply

A plain `requests.get` / HTML fetch of the page returns only the page shell — the rate table is
a WordPress **wpDataTables** widget that renders and paginates client-side via AJAX, so the raw
HTML contains no row data to parse. There's no CSV/date-range query-string API either (the UI's
"CSV" export button and Date From/To filter are DataTables Buttons/extension features operating
on already-fetched table data, not separate server endpoints) — so scraping the rendered HTML or
guessing a `?from=&to=` URL pattern was a dead end.

## What worked

Reading the page's embedded wpDataTables config (`grep`-ing the raw HTML for `ajax":{"url"`)
revealed the actual data source: a standard **DataTables server-side-processing (SSP)**
endpoint, `POST https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=193`.
This is the same call the browser's own table widget makes to page/filter/sort — no
authentication, cookies, or WordPress nonce required (checked; none of the response or embedded
config referenced a `wdtNonce`-style token, and a plain POST worked).

Sending the standard SSP body with `length=-1` (the table's "Show All entries" option, not a
DataTables Buttons feature) returns **every row in one response** rather than paginating —
verified live: `recordsTotal: 13230`, `data: [[date, currency, rate], ...]`. Response rows are
`["DD/MM/YYYY", "<CURRENCY LABEL>", "<rate as string>"]`.

## Why every run re-fetches full history, not just the new day

The platform's query path (`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`)
reads only the **latest revision's own Parquet** for a dataset with revisions — it does not use
the separately-computed "merged" artifact for querying. That means each revision must already be
the complete, self-contained history: uploading only a day's new rows would make every query
against the dataset silently lose all prior days. So `scrape()` always requests the full
`length=-1` range (2024-01-05 → today at time of writing), and every scheduled run uploads the
full accumulated CSV as a new revision (`--dataset-slug cbk-forex-rates`), matching every other
scraper in this repo (full re-scrape → full CSV each run).

## Edge cases found

- **A currency label of `""` appears** as filler on some responses (an internal wpDataTables
  header/placeholder artifact, not a real observation) — dropped via `_IGNORED_CURRENCIES`.
- **`2025-11-28` is published twice** in the raw source: all 21 currencies logged with two
  identical rows each (`recordsTotal` counts both). `parse.py` dedupes on the natural key
  `(date, currency)`, but raises `ValueError` if a repeated key ever has *conflicting* values —
  that would be a real data problem, not a harmless duplicate, and should fail loudly rather
  than silently pick one.
- **21 distinct currencies**, not the 22 suggested by the wpDataTables advanced-filter dropdown
  config embedded in the page (`AUSTRALIAN $`, `US DOLLAR`, `STG POUND`, `EURO`, `SA RAND`,
  `AE DIRHAM`, `CAN $`, `S FRANC`, `JPY (100)`, `SW KRONER`, `NOR KRONER`, `DAN KRONER`,
  `IND RUPEE`, `HONGKONG DOLLAR`, `SINGAPORE DOLLAR`, `SAUDI RIYAL`, `CHINESE YUAN`,
  `KES / USHS`, `KES / TSHS`, `KES / RWF`, `KES / BIF`) — the dropdown's `"USD"` entry never
  appears as an actual row label (`"US DOLLAR"` is the row value used instead), likely a stale
  filter-option artifact on CBK's side.

See `validate.py` for the checks that catch regressions of this kind — in particular the
`recordsTotal` cross-check (independent of the parser's own row count, since the API reports it
separately from the `data` array) and the natural-key-uniqueness check that would catch the
2025-11-28-style duplication if the dedup logic in `parse.py` ever regressed.
