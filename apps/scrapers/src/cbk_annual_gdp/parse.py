from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Annual GDP" wpDataTable on GDP_PAGE_URL (server-rendered, not AJAX)


def _parse_int(raw: str) -> int:
    return int(raw.replace(",", ""))


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", id=TABLE_ID)
    if table is None:
        raise ValueError(f"Could not find table#{TABLE_ID} in the page HTML")

    by_year: dict[int, dict] = {}
    for row in table.find("tbody").find_all("tr"):
        cells = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cells) != 4:
            raise ValueError(f"Unexpected row shape (expected 4 cells): {cells!r}")

        raw_year, raw_nominal, raw_growth, raw_real = cells
        record = {
            "year": int(raw_year),
            "nominal_gdp_prices": _parse_int(raw_nominal),
            "real_gdp_growth": _parse_float(raw_growth),
            "real_gdp_prices": _parse_int(raw_real),
        }
        existing = by_year.get(record["year"])
        if existing is not None and existing != record:
            raise ValueError(
                f"Conflicting rows for year {record['year']}: {existing} vs {record}"
            )
        by_year[record["year"]] = record

    return list(by_year.values())
