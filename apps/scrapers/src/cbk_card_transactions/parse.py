from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Number of Transactions" wpDataTable on TRANSACTIONS_PAGE_URL
# (server-rendered, not AJAX). The "ATM Cards" column is hidden in the UI (bVisible:false in
# the embedded config) but still present in the raw HTML <tbody>.

FIELDNAMES = [
    "year",
    "month",
    "atm_cards",
    "prepaid_cards",
    "charge_cards",
    "credit_cards",
    "debit_cards",
    "pos_machines",
    "total",
]


def _parse_number(raw: str) -> float:
    # Almost every value is an integer count, but one observed row (2010-03, debit_cards) has
    # a decimal value (6647688.16) — parse as float throughout rather than crashing on int().
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
            raw_atm,
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
            "atm_cards": _parse_number(raw_atm),
            "prepaid_cards": _parse_number(raw_prepaid),
            "charge_cards": _parse_number(raw_charge),
            "credit_cards": _parse_number(raw_credit),
            "debit_cards": _parse_number(raw_debit),
            "pos_machines": _parse_number(raw_pos),
            "total": _parse_number(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
