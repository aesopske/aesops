from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Central Bank Rates (%)" wpDataTable on CBR_PAGE_URL (server-rendered,
# not AJAX)

FIELDNAMES = [
    "year",
    "month",
    "repo",
    "reverse_repo",
    "interbank_rate",
    "tbill_91_day",
    "tbill_182_day",
    "tbill_364_day",
    "cash_reserve_requirement",
    "central_bank_rate",
]

# Missing values are published as either an empty cell or a literal "-" placeholder (never both
# in the same field, and never an entire row) — both mean "not reported for this month", not 0.
_MISSING_MARKERS = {"", "-"}


def _parse_float_or_none(raw: str) -> float | None:
    if raw in _MISSING_MARKERS:
        return None
    return float(raw.replace(",", ""))


def parse_response(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", id=TABLE_ID)
    if table is None:
        raise ValueError(f"Could not find table#{TABLE_ID} in the page HTML")

    by_key: dict[tuple[int, str], dict] = {}
    for row in table.find("tbody").find_all("tr"):
        cells = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cells) != 10:
            raise ValueError(f"Unexpected row shape (expected 10 cells): {cells!r}")

        (
            raw_year,
            month,
            raw_repo,
            raw_reverse_repo,
            raw_interbank,
            raw_91,
            raw_182,
            raw_364,
            raw_crr,
            raw_cbr,
        ) = cells

        record = {
            "year": int(raw_year),
            "month": month,
            "repo": _parse_float_or_none(raw_repo),
            "reverse_repo": _parse_float_or_none(raw_reverse_repo),
            "interbank_rate": _parse_float_or_none(raw_interbank),
            "tbill_91_day": _parse_float_or_none(raw_91),
            "tbill_182_day": _parse_float_or_none(raw_182),
            "tbill_364_day": _parse_float_or_none(raw_364),
            "cash_reserve_requirement": _parse_float_or_none(raw_crr),
            "central_bank_rate": _parse_float_or_none(raw_cbr),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
