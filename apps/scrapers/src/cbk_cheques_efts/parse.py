from bs4 import BeautifulSoup

TABLE_ID = "table_1"  # "Cheques & EFTs" wpDataTable on CHEQUES_EFTS_PAGE_URL (server-rendered,
# not AJAX)

FIELDNAMES = [
    "year",
    "month",
    "credit_efts_volume",
    "credit_efts_value_ksh_billions",
    "debit_cheques_volume",
    "debit_cheques_value_ksh_billions",
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

        (
            raw_year,
            month,
            raw_credit_volume,
            raw_credit_value,
            raw_debit_volume,
            raw_debit_value,
        ) = cells

        record = {
            "year": int(raw_year),
            "month": month,
            "credit_efts_volume": _parse_int(raw_credit_volume),
            "credit_efts_value_ksh_billions": _parse_float(raw_credit_value),
            "debit_cheques_volume": _parse_int(raw_debit_volume),
            "debit_cheques_value_ksh_billions": _parse_float(raw_debit_value),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
