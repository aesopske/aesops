# Extraction notes: CBK Commercial Banks Weighted Average Rates

**Source**: `https://www.centralbank.go.ke/commercial-banks-weighted-average-rates/` — the
"Commercial Banks Weighted Average Rates (%)" wpDataTables table
(`table#table_1`, `data-wpdatatable_id="17"`).

## What this dataset is

Monthly weighted average interest rates (%) that Kenyan commercial banks pay/charge, back to
**September 1991**: `deposit` and `savings` rates (paid to depositors) and `lending` and
`overdraft` rates (charged to borrowers). The page name ("weighted average rates") doesn't say
which rates — these four are it.

## What was tried and why it worked

Unlike `cbk_annual_gdp`/`cbk_foreign_trade`/`cbk_inflation`, this table's embedded config has
`"serverSide":true` with an explicit `ajax.url` — same shape as `cbk_forex`. A plain HTML GET
only returns the page shell; the real data source is the standard DataTables
server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=17`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 421`, `data: [[year, month,
deposit, savings, lending, overdraft], ...]` (as strings; `wdtType` is `"string"` for the rate
columns in the page's embedded config, but every observed value parses cleanly as a float — no
placeholder/empty strings encountered).

## Edge case: a genuine conflicting duplicate (year, month), not just a harmless repeat

Two duplicate `(year, month)` situations were found in the raw 421-row response:

- **`2023-11` and `2023-12`** each appear twice with **identical** values — a harmless repeat,
  same pattern seen in `cbk_forex`/`cbk_inflation`.
- **`2026-02`** appears twice with **different, conflicting** values:
  `('6.92', '3.17', '14.78', '13.31')` vs `('6.82', '2.41', '14.78', '13.31')` (deposit and
  savings differ; lending and overdraft agree). There is no row-ID, timestamp, or other field in
  the SSP response to determine which value is the correction and which is stale — the raw
  `data` array is just `[year, month, rate, rate, rate, rate]` per row.

`cbk_forex`'s convention is to raise `ValueError` on a conflicting duplicate rather than
silently pick one — appropriate there because a real conflict was assumed to indicate a parsing
bug. Here it's a confirmed, isolated **source-side republication**, so raising on every run would
permanently break the scraper for no gain. Instead, `parse.py` dedupes on the **full row**
(all six fields), which:
- collapses harmless exact-duplicate rows (`2023-11`, `2023-12`) down to one each, and
- **keeps both** rows for the genuine `2026-02` conflict, rather than guessing which value is
  correct.

`validate.py`'s uniqueness check allows this one specific `(year, month)` key
(`KNOWN_CONFLICTING_KEY = (2026, "February")`) to appear twice and will still fail loudly on any
*other* unexpected duplicate — so a future new conflict elsewhere in the table is caught rather
than silently swallowed by a blanket exception.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision
(`--dataset-slug cbk-weighted-average-rates`).

See `validate.py` for the checks that catch regressions of this kind.
