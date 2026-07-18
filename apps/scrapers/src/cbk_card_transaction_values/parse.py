from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Value of Transactions (Kshs. Millions)" wpDataTable on
# TRANSACTION_VALUES_PAGE_URL (server-rendered, not AJAX). The "ATM Cards" column is hidden in
# the UI (bVisible:false in the embedded config) but still present in the raw HTML <tbody>.

FIELDNAMES = [
    "year",
    "month",
    "atm_cards_ksh_millions",
    "prepaid_cards_ksh_millions",
    "charge_cards_ksh_millions",
    "credit_cards_ksh_millions",
    "debit_cards_ksh_millions",
    "pos_machines_ksh_millions",
    "total_ksh_millions",
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
            "atm_cards_ksh_millions": _parse_float(raw_atm),
            "prepaid_cards_ksh_millions": _parse_float(raw_prepaid),
            "charge_cards_ksh_millions": _parse_float(raw_charge),
            "credit_cards_ksh_millions": _parse_float(raw_credit),
            "debit_cards_ksh_millions": _parse_float(raw_debit),
            "pos_machines_ksh_millions": _parse_float(raw_pos),
            "total_ksh_millions": _parse_float(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
