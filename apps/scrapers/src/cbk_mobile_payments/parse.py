from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Mobile Payments" wpDataTable on MOBILE_PAYMENTS_PAGE_URL
# (server-rendered, not AJAX)

FIELDNAMES = [
    "year",
    "month",
    "active_agents",
    "registered_accounts_millions",
    "agent_cash_in_out_volume_million",
    "agent_cash_in_out_value_ksh_billions",
]


def _parse_int(raw: str) -> int:
    return int(raw.replace(",", ""))


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

        raw_year, month, raw_agents, raw_accounts, raw_volume, raw_value = cells
        record = {
            "year": int(raw_year),
            "month": month,
            "active_agents": _parse_int(raw_agents),
            "registered_accounts_millions": _parse_float(raw_accounts),
            "agent_cash_in_out_volume_million": _parse_float(raw_volume),
            "agent_cash_in_out_value_ksh_billions": _parse_float(raw_value),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
