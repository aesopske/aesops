from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Value Direct Imports Per Commodities (Ksh Million)" wpDataTable on
# DIRECT_IMPORTS_PAGE_URL (server-rendered, not AJAX)

FIELDNAMES = [
    "year",
    "month",
    "food_and_live_animals",
    "beverages_and_tobacco",
    "crude_materials",
    "mineral_fuels",
    "animal_vegetable_oils",
    "chemicals",
    "manufactured_goods",
    "machinery_transport",
    "other",
    "total",
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
        if len(cells) != 12:
            raise ValueError(f"Unexpected row shape (expected 12 cells): {cells!r}")

        (
            raw_year,
            month,
            raw_food,
            raw_beverages,
            raw_crude,
            raw_mineral,
            raw_animals,
            raw_chemicals,
            raw_manufactured,
            raw_machinery,
            raw_other,
            raw_total,
        ) = cells

        record = {
            "year": int(raw_year),
            "month": month,
            "food_and_live_animals": _parse_float(raw_food),
            "beverages_and_tobacco": _parse_float(raw_beverages),
            "crude_materials": _parse_float(raw_crude),
            "mineral_fuels": _parse_float(raw_mineral),
            "animal_vegetable_oils": _parse_float(raw_animals),
            "chemicals": _parse_float(raw_chemicals),
            "manufactured_goods": _parse_float(raw_manufactured),
            "machinery_transport": _parse_float(raw_machinery),
            "other": _parse_float(raw_other),
            "total": _parse_float(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
