from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Diaspora Remittances" wpDataTable on DIASPORA_REMITTANCES_PAGE_URL
# (server-rendered, not AJAX)

FIELDNAMES = ["year", "month", "north_america", "europe", "rest_of_world", "total_usd_thousands"]

# Unlike every other CBK table scraped so far, the raw "Month" column here is a numeric string
# (inconsistently zero-padded: "01".."12" in older rows, "1".."12" in newer ones), not a month
# name. Mapped to full names to match the convention used by every other scraper in this repo.
_MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
        if len(cells) != 6:
            raise ValueError(f"Unexpected row shape (expected 6 cells): {cells!r}")

        raw_year, raw_month, raw_na, raw_eu, raw_rest, raw_total = cells
        month_num = int(raw_month)
        if not 1 <= month_num <= 12:
            raise ValueError(f"Unexpected month value: {raw_month!r}")

        record = {
            "year": int(raw_year),
            "month": _MONTH_NAMES[month_num - 1],
            "north_america": _parse_float(raw_na),
            "europe": _parse_float(raw_eu),
            "rest_of_world": _parse_float(raw_rest),
            "total_usd_thousands": _parse_float(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
