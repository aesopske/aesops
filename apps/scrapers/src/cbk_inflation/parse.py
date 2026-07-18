from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Inflation Rates" wpDataTable on INFLATION_PAGE_URL (server-rendered,
# not AJAX)

FIELDNAMES = ["year", "month", "annual_average_inflation", "twelve_month_inflation"]


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
        if len(cells) != 4:
            raise ValueError(f"Unexpected row shape (expected 4 cells): {cells!r}")

        raw_year, month, raw_annual_avg, raw_twelve_month = cells
        record = {
            "year": int(raw_year),
            "month": month,
            "annual_average_inflation": _parse_float(raw_annual_avg),
            "twelve_month_inflation": _parse_float(raw_twelve_month),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
