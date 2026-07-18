# Extraction notes: CBK Domestic Foreign Currency Cheques (DFCC)

**Source**:
`https://www.centralbank.go.ke/national-payments-system/automated-clearing-house/dfcc/` — the
"Domestic Foreign Currency Cheque(s)" wpDataTables table (`table#table_1`,
`data-wpdatatable_id="138"`).

## What this dataset is

Monthly Kenyan automated clearing house activity for **domestic foreign-currency cheques** —
cheques cleared within Kenya but denominated in a foreign currency — broken down by currency:
`usd_value`/`usd_volume`, `euro_value`/`euro_volume`, `gbp_value`/`gbp_volume`, back to **August
2011**. The page's own embedded column config doesn't state a unit for the `*_value` columns
(no "(Millions)"/"(Ksh Billions)" suffix like other CBK tables carry); values are left as
published (typically low double-to-triple digits per month, consistent with each currency's own
millions, not Ksh-equivalent) — treat the unit as "whatever CBK's own export/print title says"
if this needs confirming later, since the page doesn't spell it out anywhere machine-readable.

## What was tried and why it worked

Same shape as `cbk_forex`/`cbk_weighted_average_rates`: the embedded config has
`"serverSide":true` with an explicit `ajax.url`. A plain HTML GET only returns the page shell;
the real data source is the standard DataTables server-side-processing endpoint `POST
https://www.centralbank.go.ke/wp-admin/admin-ajax.php?action=get_wdtable&table_id=138`, no
auth/cookies/nonce required. Sending the standard SSP body with `length=-1` ("Show All entries")
returns every row in one response — verified live: `recordsTotal: 178`, `data: [[year, month,
usd_value, usd_volume, euro_value, euro_volume, gbp_value, gbp_volume], ...]`.

## Edge case: a genuine conflicting duplicate (year, month)

Same situation as `cbk_weighted_average_rates`: `2024-01` appears twice in the raw 178-row
response with **completely different values across every column**
(`('57.26', '21.43', '2.23', '0.61', '0.29', '0.08')` vs
`('59.12', '22.29', '1.82', '0.55', '0.11', '0.07')`) — no row-ID, timestamp, or other field in
the SSP response to determine which is the correction. No empty cells and no other duplicate
keys were found across all 178 rows.

`parse.py` dedupes on the **full row** (all eight fields), which keeps both sides of this
genuine conflict rather than guessing which value is correct. `validate.py`'s uniqueness check
allows this one specific `(year, month)` key (`KNOWN_CONFLICTING_KEY = (2024, "January")`) to
appear twice and will still fail loudly on any *other* unexpected duplicate.

## Why every run re-uploads full history, not just the new month

Same reasoning as the other CBK scrapers (see their `NOTES.md`): the platform's query path
(`apps/web/src/lib/platform/dataset-source.ts`, `resolveQueryDoc`) reads only the **latest
revision's own Parquet** — not a separately-computed merged artifact — so each revision must
already be the complete, self-contained history. `scrape()` always requests the full `length=-1`
range and every scheduled run uploads the full CSV as a new revision (`--dataset-slug cbk-dfcc`).

See `validate.py` for the checks that catch regressions of this kind.
