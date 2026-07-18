from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Number of ATMs, ATM Cards, & POS Machines" wpDataTable on
# ATMS_CARDS_POS_PAGE_URL (server-rendered, not AJAX)

FIELDNAMES = [
    "year",
    "month",
    "atms",
    "atm_cards",
    "prepaid_cards",
    "charge_cards",
    "credit_cards",
    "debit_cards",
    "pos_machines",
    "total_cards",
]


def _parse_int(raw: str) -> int:
    return int(raw.replace(",", ""))


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
            raw_atms,
            raw_atm_cards,
            raw_prepaid,
            raw_charge,
            raw_credit,
            raw_debit,
            raw_pos,
            raw_total,
        ) = cells

        record = {
            "year": int(raw_year),
            "month": month,
            "atms": _parse_int(raw_atms),
            "atm_cards": _parse_int(raw_atm_cards),
            "prepaid_cards": _parse_int(raw_prepaid),
            "charge_cards": _parse_int(raw_charge),
            "credit_cards": _parse_int(raw_credit),
            "debit_cards": _parse_int(raw_debit),
            "pos_machines": _parse_int(raw_pos),
            "total_cards": _parse_int(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
