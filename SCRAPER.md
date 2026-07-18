# PDF Scraper Guide

This document explains how HMO (House in Multiple Occupation) licence registers are
scraped from council PDF documents in this repo, how a scraper run is wired together
end to end, and how to add a new PDF-based scraper. It also calls out real bugs found
in existing scrapers so they aren't copied into new ones.

## 1. Architecture at a glance

There is no base `Scraper` class to subclass. The only contract a scraper module must
satisfy is the `ScraperModule` `Protocol` in `src/scrapers/__init__.py`:

```python
class ScraperModule(Protocol):
    def scrape(self, portal_id: int, logger: Logger) -> List[constants.HMO_RECORD]: ...
```

Any module under `src/scrapers/<council>/__init__.py` that exposes a top-level
`scrape(portal_id, logger)` function qualifies. Extension/platform code (`PDFScraper`,
`SpreadsheetScraper`, `idox`, `metastreet`, etc.) is composition, not inheritance —
a scraper module constructs one of these engines and returns its `.scrape()` result.

Full run, end to end:

```
main.py
  -> args.pid given?  -> [that portal]
     else              -> all keys in scrapers.PORTAL_MAP
  -> scrapers.get_portal_info(portal_id)
       -> PORTAL_MAP[portal_id] gives {"name", "module"}
       -> importlib.import_module(f".{module}", package="src.scrapers")  (dynamic import)
  -> module.scrape(portal_id, logger)
       -> PDFScraper(...).scrape()   # for PDF-based councils
  -> List[HMO_RECORD] (list of dicts)
  -> if --save-db: DBUtils.bulk_upsert_hmo_licences(session, hmo_data)
       -> each record validated through validators.schemas.LicenceSchema (Pydantic)
       -> upserted into `hmo_register`, keyed on `ref`
  -> on any exception: DBUtils.create_failed_record(...) -> `hmo_failed_districts`
```

A separate, independent pipeline (`src/libscripts/address_lookup.py`) later enriches
saved records with UPRN/geometry by calling an external `address-lookup` package. It is
not part of `main.py` and runs on its own (either a one-shot `--pid` CLI mode or a
queue-polling `run_lookup_worker()`).

DB schema is managed by Alembic (`alembic/versions/`), not by the ad-hoc
`create_tables()` fallback in `DBUtils`.

## 2. Running scrapers

```bash
python main.py                      # run every portal in PORTAL_MAP
python main.py -pid 133             # run a single portal (Telford & Wrekin)
python main.py -pid 133 --save-db   # also upsert results into the database
python main.py -env prod            # dev (default) or prod logging/env
```

Args are defined in `src/config/__init__.py` (`Config._get_args`): `-env/--env`
(`dev`|`prod`), `-pid/--portal_id`, `-save-db/--save-db` (flag). Logging is set up via
`LogManager` (`src/utils/log_utils.py`), which creates a per-scraper JSON logger.

## 3. The `PDFScraper` engine (`src/templates/pdf/__init__.py`)

`PDFScraper` is a configurable engine you instantiate per scraper — you do not subclass
it. Behavior is customized via a `PDFPipelineConfig` (a `TypedDict`) plus callback
functions.

```python
PDFScraper(
    url: str,
    portal_id: int,
    link_text: str = "",
    use_url_as_source: bool = False,
    logger: Optional[Logger] = None,
    playwright_config: Optional[DEFAULT_PLAYWRIGHT_CONFIG] = None,
    pipeline_config: Optional[PDFPipelineConfig] = None,
)
```

The constructor immediately resolves `self.hmo_url` by calling `_get_pdf_url()` — the
PDF link is found before `.scrape()` is even invoked.

### `scrape()` orchestration

```python
pdf_bytes  = self.download_pdf()
raw_rows   = self.extract_pdf_data(pdf_bytes)     # pdfplumber, mode-dependent
cleaned    = self.clean_data(raw_rows)            # config["clean_data"] + merge_fields
unique_cols = common_utils.get_unique_values(cleaned)
keymap     = self.km.generate_map(unique_cols)    # KEYMAP_GEN fuzzy header->field map
keymap     = config["update_keymap"](keymap) if provided
formatted  = [common_utils.update_from_map(r, keymap) for r in cleaned]
formatted  = [config["custom_formatting"](r) for r in formatted] if provided
return common_utils.format_records(formatted, self.hmo_url, self.portal_id)
```

### Finding the PDF (`_get_pdf_url`)

- `use_url_as_source=True` — treat `url` itself as the PDF link (skip link-finding).
- `config["get_pdf_url"]` — fully custom callable that returns the PDF URL.
- Default — GET `url` with `requests` (falls back to Playwright
  `page.goto(..., wait_until="networkidle")` if the plain request fails), parse with
  BeautifulSoup, and find an `<a>` whose text contains `link_text`
  (case-insensitive), or use `config["link_finder"](soup, link_text)` if given.
  `config["modify_pdf_url"]` can post-process the href (e.g. strip a query string),
  and relative links are resolved against the page's base URL.

**Prefer link-finding over hardcoding the PDF URL.** Hardcoding breaks silently the
next time the council renames or re-dates the file (see the west_oxfordshire
anti-pattern in §5).

### Downloading (`download_pdf`)

`requests`/`curl_cffi` GET with `timeout=60, stream=True`; raises on non-200 or empty
content; falls back to `self.pw.download_file(...)` (Playwright) on failure. Set
`pipeline_config["use_curl"] = True` (plus `custom_headers`) when a council's site
blocks plain `requests` — see `PlaywrightBrowser` in `src/libscripts/playwright.py` for
the JS-rendering/anti-bot fallback used throughout.

### Extraction modes (`extract_pdf_data`) — pick one via `extraction_mode`

| Mode                | When to use it                                                                        | What it does                                                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `"table"` (default) | The PDF has genuine tabular structure pdfplumber can detect (rare in practice)        | `page.extract_table(table_settings)` per page, headers collapsed from the first page, rows converted to dicts via `common_utils.extract_table_data`. No custom parser needed — rely on `KEYMAP_GEN` to map headers to canonical fields. |
| `"text_blocks"`     | The PDF is a flat, free-text public register (the common case for these council PDFs) | Concatenates `page.extract_text()` across pages into one string and requires `pipeline_config["custom_text_parse"](text) -> List[Dict]` to turn it into records.                                                                        |
| `"page_parser"`     | Records need per-page table handling that doesn't fit the generic table mode          | Extracts a table per page and passes it to `pipeline_config["custom_page_parser"](table) -> record                                                                                                                                      | List[record]`. |

Decision tree: try opening the PDF and check if `page.extract_table()` reliably returns
clean rows. If yes, use `"table"`. If the PDF is really just paragraphs/lines of text
(most council "public registers" are), use `"text_blocks"` and write a text parser.

### Other `PDFPipelineConfig` knobs

- `clean_data(records) -> records` — arbitrary pre-cleaning before merging/keymap.
- `merge_fields: {new_field: {"fields": [...], "separator": ", "}}` — collapse several
  raw columns (e.g. multi-line address parts) into one field.
- `update_keymap(keymap) -> keymap` — override/patch the auto-generated header map.
- `custom_formatting(record) -> record` — last-mile per-record tweaks after keymapping.
- `page_count`, `header_count` — limit pages read / how many header rows to collapse.
- `table_settings`, `lattice`, `stream`, `keep_layout` — pdfplumber table/text tuning.

## 4. Writing a new PDF scraper — step by step

1. Create `src/scrapers/<council>/__init__.py` exposing:
    ```python
    def scrape(portal_id: int, logger: Optional[Logger] = None) -> List[constants.HMO_RECORD]:
        ...
    ```
2. Find the council's HMO register page and the visible text of the link to the PDF
   (e.g. "Download the Public Register"). Construct:
    ```python
    scraper = PDFScraper(
        url=HMO_PAGE_URL,
        portal_id=portal_id,
        logger=logger,
        link_text="Download the Public Register",
        pipeline_config=PDFPipelineConfig(
            extraction_mode="text_blocks",
            custom_text_parse=text_parser,
        ),
    )
    return scraper.scrape()
    ```
3. Only use `use_url_as_source=True` with a hardcoded PDF URL as a last resort (e.g. the
   link-finder genuinely cannot locate it) — and if you do, prefer deriving the URL
   dynamically rather than hardcoding a dated filename.
4. If `extraction_mode="table"` works (check by testing `extract_table()` on the PDF
   directly), skip writing a custom parser and let `KEYMAP_GEN` map headers to the
   canonical `HMO_FIELDS` (`licence_number`, `licensee`, `licensee_address`, `address`,
   `licence_type`, `max_occupancy`, `number_of_rooms`, `uprn`, `geometry`,
   `licence_status`, `date_granted`, `expiry_date` — see `src/utils/keymap_gen.py`).
5. If you need `"text_blocks"`, write `text_parser(raw_text: str) -> List[Dict]`. Reuse
   the existing helpers in `src/utils/common.py` instead of hand-rolling regex from
   scratch — see §6. Most council registers share the same shape per row: a licence
   number, an address/licensee block, one or two trailing dates, and a trailing
   occupancy/room count. Write the parser to peel these off from the edges (as
   `telford_wrekin` does) rather than assuming a fixed column order.
6. **Return every field you can, but don't hand-build `ref`.** `PDFScraper.scrape()`
   calls `common_utils.format_records()` for you, which normalizes addresses/dates/ints
   and generates `record["ref"]` as an MD5 hash of
   `licence_number-expiry_date-portal_id`. If your parser can't find a real licence
   number, do not hardcode a placeholder like `"UNKNOWN"` (see §5) — a missing/blank
   licence number degrades the dedup key and can cause distinct HMOs to collide or
   never update, since every record for that council would hash to the same `ref` once
   the other two fields also repeat (e.g. same expiry date on a re-scrape).
7. Register the portal in `PORTAL_MAP` (`src/scrapers/__init__.py`):
    ```python
    409: {"name": "New Council", "module": "new_council"},
    ```
    (Numeric portal IDs are otherwise unmanaged/manual — just pick an unused one.)
8. Test locally: `python main.py -pid <id>` (add `--save-db` once you're confident in
   the output) and inspect the logged sample of cleaned/formatted records.

## 5. Known issues in existing scrapers — don't repeat these

These are real, verified bugs in the current codebase. They're useful as concrete
"what not to do" examples when writing a new scraper, and worth fixing if you touch
these files:

- **`src/scrapers/amber_valley/__init__.py`** — `text_parser` builds
  `record_pattern.findall(raw_text)` and loops over `(licence_id, blob)` matches, but
  the loop body never appends to a `records` list, and the function unconditionally
  `return []` at the end. This scraper currently returns **zero** parsed records —
  the parsing logic is dead code.
- **`src/scrapers/telford_wrekin/__init__.py`** — calls
  `common_utils.split_name_address(row, reverse=True)`, but
  `split_name_address(text: str) -> tuple[str, str]` in `src/utils/common.py` (line 273) takes no `reverse` keyword at all. This call raises `TypeError` at runtime.
  Either drop the argument or add `reverse` support to the shared util if the intended
  behavior (splitting from the end of the string) is actually needed.
- **`src/scrapers/barnsley/__init__.py`** — `text_parser` never attempts to extract a
  licence number and hardcodes `record["licence_number"] = "UNKNOWN"` for every row.
  Combined with `format_records`'s `ref` generation (§4 step 6), this weakens
  deduplication for this portal.
- **`src/scrapers/west_oxfordshire/__init__.py`** — hardcodes the direct PDF URL
  (including a dated filename like `...april-2026.pdf`) and a large block of literal
  Chrome browser headers/fingerprint values directly in the scraper file, bypassing the
  template's link-finding and needing manual updates whenever the council re-publishes
  the file under a new name. If a council needs anti-bot header spoofing, prefer
  `use_curl=True` + a small, purpose-named `custom_headers` dict over copy-pasting a
  full literal browser fingerprint per scraper — and prefer link-finding via
  `link_text` over a hardcoded, dated URL.

When writing a new scraper, treat regex text-parsing as genuinely per-council (PDF
layouts vary too much for a single shared parser), but do reuse the field-level helpers
in `src/utils/common.py` (§6) rather than re-deriving date/number/address extraction
from scratch each time — that duplication is exactly how the bugs above crept in.

## 6. Shared utilities to reuse

`src/utils/common.py`:

- `format_records(records, url, portal_id)` — final normalization step (called
  internally by `PDFScraper.scrape()`); don't call this yourself, but know what it does
  to your output (normalizes `address`/`licensee`/`licensee_address` via
  `normalize_spaces`, coerces `max_occupancy`/`number_of_rooms` via `format_int`,
  parses `date_granted`/`expiry_date` via `date_utils.parse_date_string`, and generates
  `ref` via `generate_unique_ref`).
- `generate_unique_ref(record, fields, use_hash=True)` — MD5 hash dedup key generator.
- `split_name_address(text) -> (name, address)` — anchor-based UK address/name
  splitter (no `reverse` param — see §5).
- `extract_postcode(address)` — regex UK postcode extraction.
- `extract_labeled_integers`, `process_occupancy`, `process_rooms`, `word_to_num` —
  parse strings like "2 households / 8 persons" or "3 floors 6 rooms" into ints.
- `merge_fields(fields_to_merge, record, new_key, separator=", ")` — collapse several
  raw fields into one (used via `pipeline_config["merge_fields"]`).
- `update_from_map(item, mapping)` — rename dict keys per a `{header: field}` map.
- `extract_table_data(table, headers)` — zip pdfplumber rows with headers (used
  internally by `"table"` mode).
- `normalize_spaces(text, remove_commas=True)` — whitespace/entity cleanup.

`src/utils/keymap_gen.py` — `KEYMAP_GEN.generate_map(headers)`: fuzzy-matches raw PDF
column headers to the canonical `HMO_FIELDS` using keyword/substring scoring plus
`difflib.SequenceMatcher` similarity. This is what lets `"table"` mode work without
per-council header hardcoding, and can be patched per-scraper via
`pipeline_config["update_keymap"]`.

`src/libscripts/playwright.py` — `PlaywrightBrowser` / `DEFAULT_PLAYWRIGHT_CONFIG`:
the JS-rendering and anti-bot fallback used by `PDFScraper` for both finding the PDF
link and downloading the file when plain `requests` fails.
