from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Foreign Trade Summary (Ksh Million)" wpDataTable on TRADE_PAGE_URL
# (server-rendered, not AJAX)

FIELDNAMES = [
    "year",
    "month",
    "commercial_imports",
    "government_imports",
    "total_imports",
    "domestic_fob",
    "re_exports",
    "total_exports_fob",
    "trade_balance",
]


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", id=TABLE_ID)
    if table is None:
        raise ValueError(f"Could not find table#{TABLE_ID} in the page HTML")

    by_key: dict[tuple[int, str], dict] = {}
    for row in table.find("tbody").find_all("tr"):
        cells = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cells) != 9:
            raise ValueError(f"Unexpected row shape (expected 9 cells): {cells!r}")

        (
            raw_year,
            month,
            raw_commercial,
            raw_government,
            raw_total_imports,
            raw_domestic_fob,
            raw_re_exports,
            raw_total_fob,
            raw_trade_balance,
        ) = cells

        record = {
            "year": int(raw_year),
            "month": month,
            "commercial_imports": _parse_float(raw_commercial),
            "government_imports": _parse_float(raw_government),
            "total_imports": _parse_float(raw_total_imports),
            "domestic_fob": _parse_float(raw_domestic_fob),
            "re_exports": _parse_float(raw_re_exports),
            "total_exports_fob": _parse_float(raw_total_fob),
            "trade_balance": _parse_float(raw_trade_balance),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
