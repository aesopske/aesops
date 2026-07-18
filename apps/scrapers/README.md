# scrapers

Python scrapers for dataset acquisition, managed with [uv](https://docs.astral.sh/uv/). Most are
one-off; recurring ones (see `cbk_forex`, `cbk_annual_gdp`, `cbk_foreign_trade`, `cbk_inflation`,
`cbk_weighted_average_rates`, `cbk_mobile_payments`, `cbk_atms_cards_pos`, `cbk_cheques_efts`,
`cbk_dfcc`, `cbk_card_transactions`, `cbk_card_transaction_values`, `cbk_kepss_rtgs`,
`cbk_diaspora_remittances`, `cbk_central_bank_rates`, `cbk_principal_exports`,
`cbk_domestic_exports`, `epra_pump_prices`, `cbk_african_exports`, `cbk_rest_of_world_exports`,
`cbk_direct_imports`, `cbk_african_imports`, `cbk_rest_of_world_imports`) are scheduled via
`.github/workflows/`.

Each scraper module under `src/` has its own `NOTES.md` (extraction methodology — what was
tried, what failed, what worked and why) and `validate.py` (runnable proof the output is
correct, not just that it ran) — see `.claude/skills/dataset-extraction-validation/SKILL.md`
for the pattern these follow.

## Datasets

The first four scrape the KNBS 2019 Kenya Population and Housing Census PDFs (Volume I and II);
`cbk_forex`, `cbk_annual_gdp`, `cbk_foreign_trade`, `cbk_inflation`,
`cbk_weighted_average_rates`, `cbk_mobile_payments`, `cbk_atms_cards_pos`, `cbk_cheques_efts`,
`cbk_dfcc`, `cbk_card_transactions`, `cbk_card_transaction_values`, `cbk_kepss_rtgs`,
`cbk_diaspora_remittances`, `cbk_central_bank_rates`, `cbk_principal_exports`,
`cbk_domestic_exports`, `epra_pump_prices`, `cbk_african_exports`,
`cbk_rest_of_world_exports`, `cbk_direct_imports`, `cbk_african_imports`, and
`cbk_rest_of_world_imports` are unrelated and run on a schedule rather than once.
`epra_pump_prices` is the only non-CBK recurring source (Energy and Petroleum Regulatory
Authority, not Central Bank of Kenya).

| Module | Source | Shape |
|---|---|---|
| `knbs_census` | Vol. I, Tables 2.5–2.7 | Population by county/sub-county (3-level hierarchy) |
| `county_subcounty_list` | Vol. II, Table 1.2 | Canonical county/sub-county code reference list |
| `urban_centres` | Vol. II, Table 2.5 | Flat list of urban centres by population |
| `admin_units` | Vol. II, Table 2.4 | Population down to sub-location (6-level hierarchy, 220 pages — the largest table in either volume) |
| `cbk_forex` | [CBK forex page](https://www.centralbank.go.ke/forex/) (daily indicative rates) | Flat `(date, currency, exchange_rate)` rows; runs daily on weekdays via `.github/workflows/cbk-forex-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_annual_gdp` | [CBK annual GDP page](https://www.centralbank.go.ke/annual-gdp/) | Flat `(year, nominal_gdp_prices, real_gdp_growth, real_gdp_prices)` rows; runs yearly via `.github/workflows/cbk-annual-gdp-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_foreign_trade` | [CBK foreign trade summary page](https://www.centralbank.go.ke/foreign-trade-summary/) | Flat `(year, month, commercial_imports, government_imports, total_imports, domestic_fob, re_exports, total_exports_fob, trade_balance)` rows, Aug 1998 to date; runs monthly via `.github/workflows/cbk-foreign-trade-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_inflation` | [CBK inflation rates page](https://www.centralbank.go.ke/inflation-rates/) | Flat `(year, month, annual_average_inflation, twelve_month_inflation)` rows, Jan 2005 to date — despite the page name this is monthly, not yearly, data; runs monthly via `.github/workflows/cbk-inflation-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_weighted_average_rates` | [CBK commercial banks weighted average rates page](https://www.centralbank.go.ke/commercial-banks-weighted-average-rates/) | Flat `(year, month, deposit, savings, lending, overdraft)` rows, Sep 1991 to date; runs monthly via `.github/workflows/cbk-weighted-average-rates-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for a genuine source-side data conflict this one has to handle |
| `cbk_mobile_payments` | [CBK mobile payments page](https://www.centralbank.go.ke/national-payments-system/mobile-payments/) | Flat `(year, month, active_agents, registered_accounts_millions, agent_cash_in_out_volume_million, agent_cash_in_out_value_ksh_billions)` rows, Mar 2007 to date; runs monthly via `.github/workflows/cbk-mobile-payments-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_atms_cards_pos` | [CBK number of ATMs, ATM cards & POS machines page](https://www.centralbank.go.ke/national-payments-system/payment-cards/number-of-atms-atm-cards-pos-machines/) | Flat `(year, month, atms, atm_cards, prepaid_cards, charge_cards, credit_cards, debit_cards, pos_machines, total_cards)` rows, Jul 2009 to date; runs monthly via `.github/workflows/cbk-atms-cards-pos-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_cheques_efts` | [CBK cheques & EFTs page](https://www.centralbank.go.ke/national-payments-system/automated-clearing-house/cheques-efts/) | Flat `(year, month, credit_efts_volume, credit_efts_value_ksh_billions, debit_cheques_volume, debit_cheques_value_ksh_billions)` rows, Oct 2007 to date; runs monthly via `.github/workflows/cbk-cheques-efts-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_dfcc` | [CBK domestic foreign currency cheques page](https://www.centralbank.go.ke/national-payments-system/automated-clearing-house/dfcc/) | Flat `(year, month, usd_value, usd_volume, euro_value, euro_volume, gbp_value, gbp_volume)` rows, Aug 2011 to date; runs monthly via `.github/workflows/cbk-dfcc-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for a genuine source-side data conflict this one has to handle |
| `cbk_card_transactions` | [CBK number of transactions (payment cards) page](https://www.centralbank.go.ke/national-payments-system/payment-cards/number-of-transactions/) | Flat `(year, month, atm_cards, prepaid_cards, charge_cards, credit_cards, debit_cards, pos_machines, total)` rows, Jul 2009 to date — companion dataset to `cbk_atms_cards_pos` (transaction counts, not card/machine counts); runs monthly via `.github/workflows/cbk-card-transactions-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_card_transaction_values` | [CBK value of transactions (payment cards, Ksh Millions) page](https://www.centralbank.go.ke/national-payments-system/payment-cards/value-of-transactions-ksh-millions/) | Flat `(year, month, atm_cards_ksh_millions, prepaid_cards_ksh_millions, charge_cards_ksh_millions, credit_cards_ksh_millions, debit_cards_ksh_millions, pos_machines_ksh_millions, total_ksh_millions)` rows, Jul 2009 to date — companion dataset to `cbk_card_transactions` (transaction values, not counts); runs monthly via `.github/workflows/cbk-card-transaction-values-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_kepss_rtgs` | [CBK KEPSS/RTGS page](https://www.centralbank.go.ke/national-payments-system/kepss-rtgs/) | Flat `(year, month, volume, value_ksh_millions)` rows, Aug 2005 to date; runs monthly via `.github/workflows/cbk-kepss-rtgs-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for a genuine source-side data conflict this one has to handle |
| `cbk_diaspora_remittances` | [CBK diaspora remittances page](https://www.centralbank.go.ke/diaspora-remittances/) | Flat `(year, month, north_america, europe, rest_of_world, total_usd_thousands)` rows, Jan 2004 to date — raw source month is a numeric string, mapped to full month names; runs monthly via `.github/workflows/cbk-diaspora-remittances-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_central_bank_rates` | [CBK central bank rates page](https://www.centralbank.go.ke/central-bank-rates/) | Flat `(year, month, repo, reverse_repo, interbank_rate, tbill_91_day, tbill_182_day, tbill_364_day, cash_reserve_requirement, central_bank_rate)` rows, Jul 1991–Jul 2016 only — this table has not been updated since 2016, unlike every other CBK scraper here; runs monthly (a no-op re-upload until/unless the source resumes) via `.github/workflows/cbk-central-bank-rates-scraper.yml` — see its `NOTES.md` for missing-value handling |
| `cbk_principal_exports` | [CBK principal exports (volume, value & unit prices) page](https://www.centralbank.go.ke/principal-exports-volume-value-unit-prices/) | Flat `(year, month, volume_coffee, value_coffee, average_coffee, volume_tea, value_tea, average_tea, volume_hort, value_hort, average_hort)` rows, Aug 1998 to date; runs monthly via `.github/workflows/cbk-principal-exports-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_domestic_exports` | [CBK value of selected domestic exports page](https://www.centralbank.go.ke/value-selected-domestic-exports/) | Flat `(year, month, coffee, tea, petroleum, chemicals, fish, horticulture, cement, other, total)` rows, Aug 1998 to date — same page family as `cbk_principal_exports` but value-only across all commodity categories; runs monthly via `.github/workflows/cbk-domestic-exports-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for a data-quality anomaly confined to 2018 |
| `epra_pump_prices` | [EPRA pump prices page](https://www.epra.go.ke/pump-prices) (not CBK) | Flat `(period_from, period_to, town, super_pms, diesel_ago, kerosene_ik)` rows, one row per town per ~monthly price review period, Nov 2024 to date; runs monthly via `.github/workflows/epra-pump-prices-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for why |
| `cbk_african_exports` | [CBK value of exports to selected African countries page](https://www.centralbank.go.ke/value-exports-selected-african-countries/) | Flat `(year, month, uganda, tanzania, zambia, egypt, rwanda, zimbabwe, ethiopia, somalia, south_africa, drc, other, total)` rows, Sep 1998 to date; runs monthly via `.github/workflows/cbk-african-exports-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for a two-month data-quality anomaly |
| `cbk_rest_of_world_exports` | [CBK value of exports to selected rest of world countries page](https://www.centralbank.go.ke/value-exports-selected-rest-world-countries/) | Flat `(year, month, uk, germany, usa, netherlands, uganda, tanzania, pakistan, france, egypt, belgium, others, total)` rows, Sep 1998 to date — same page family as `cbk_african_exports`, note the country lists overlap (Uganda/Tanzania/Egypt appear on both); reconciles cleanly with no known exceptions; runs monthly via `.github/workflows/cbk-rest-of-world-exports-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` |
| `cbk_direct_imports` | [CBK value of direct imports per commodities page](https://www.centralbank.go.ke/value-direct-imports-per-commodities/) | Flat `(year, month, food_and_live_animals, beverages_and_tobacco, crude_materials, mineral_fuels, animal_vegetable_oils, chemicals, manufactured_goods, machinery_transport, other, total)` rows, Aug 1998 to date; reconciles cleanly with no known exceptions; runs monthly via `.github/workflows/cbk-direct-imports-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` |
| `cbk_african_imports` | [CBK value of direct imports from selected African countries page](https://www.centralbank.go.ke/value-direct-imports-selected-african-countries/) | Flat `(year, month, uganda, tanzania, zambia, egypt, south_africa, zimbabwe, other, total)` rows, Sep 1998 to date — import-side companion to `cbk_african_exports`, but with a smaller (non-matching) country list; runs monthly via `.github/workflows/cbk-african-imports-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for a one-month data-quality anomaly |
| `cbk_rest_of_world_imports` | [CBK value of direct imports from selected rest of world countries page](https://www.centralbank.go.ke/value-direct-imports-selected-rest-world-countries/) | Flat `(year, month, uk, usa, germany, italy, uae, saudi_arabia, france, india, south_africa, japan, others, total)` rows, Sep 1998 to date — import-side companion to `cbk_rest_of_world_exports`, but with a non-matching country list; runs monthly via `.github/workflows/cbk-rest-of-world-imports-scraper.yml`, re-uploading the full history each time — see its `NOTES.md` for a data-quality anomaly confined to 1998-1999 |

### Run a scraper

```bash
uv sync
uv run python -m src.<dataset>.main       # writes output/*.{json,csv}
uv run python -m src.<dataset>.validate   # checks the output against the source
```

e.g. `uv run python -m src.admin_units.main`.

## Shared utilities (`src/utils/`)

- `download.py` — `download_pdf(url)`; wraps `requests` with `truststore` (KNBS's server
  doesn't send its intermediate TLS cert, so the OS trust store is used instead of certifi)
  and a browser `User-Agent`.
- `output.py` — `write_records(records, fieldnames, name)`; writes `output/<name>.{json,csv}`.
- `text.py` — number/name parsing helpers for `knbs_census`'s dot-leader-corrupted PDF text.
