from datetime import datetime

from bs4 import BeautifulSoup

TABLE_ID = "datatable"  # Drupal Views "Pump Prices" table on PUMP_PRICES_PAGE_URL
# (server-rendered, not AJAX — the full history is already in the raw HTML)

FIELDNAMES = ["period_from", "period_to", "town", "super_pms", "diesel_ago", "kerosene_ik"]


def _parse_date(raw: str) -> str:
    return datetime.strptime(raw, "%d-%m-%Y").date().isoformat()


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", id=TABLE_ID)
    if table is None:
        raise ValueError(f"Could not find table#{TABLE_ID} in the page HTML")

    by_key: dict[tuple[str, str, str], dict] = {}
    for row in table.find("tbody").find_all("tr"):
        cells = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cells) != 6:
            raise ValueError(f"Unexpected row shape (expected 6 cells): {cells!r}")

        raw_from, raw_to, town, raw_super, raw_diesel, raw_kerosene = cells
        record = {
            "period_from": _parse_date(raw_from),
            "period_to": _parse_date(raw_to),
            "town": town,
            "super_pms": _parse_float(raw_super),
            "diesel_ago": _parse_float(raw_diesel),
            "kerosene_ik": _parse_float(raw_kerosene),
        }
        key = (record["period_from"], record["period_to"], record["town"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
