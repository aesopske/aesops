from bs4 import BeautifulSoup

# Unlike every other CBK page scraped so far, this page's wpDataTable element is id="table_3"
# (data-wpdatatable_id="68"), not "table_1" — the page apparently has (or once had) other
# tables ahead of it in the CMS's internal numbering, even though only one is rendered here.
TABLE_ID = "table_3"

FIELDNAMES = ["year", "month", "volume", "value_ksh_millions"]


def _parse_int(raw: str) -> int:
    return int(raw.replace(",", ""))


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", id=TABLE_ID)
    if table is None:
        raise ValueError(f"Could not find table#{TABLE_ID} in the page HTML")

    # (year, month) is not a reliable dedup key here — the source has published a genuine
    # conflicting duplicate for a real (year, month), same as cbk_weighted_average_rates and
    # cbk_dfcc (see NOTES.md, "2016-01"). Deduping on the *full* record instead drops harmless
    # exact-duplicate rows while preserving both sides of a genuine conflict rather than
    # silently discarding one.
    seen: dict[tuple, dict] = {}
    for row in table.find("tbody").find_all("tr"):
        cells = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cells) != 4:
            raise ValueError(f"Unexpected row shape (expected 4 cells): {cells!r}")

        raw_year, month, raw_volume, raw_value = cells
        record = {
            "year": int(raw_year),
            "month": month,
            "volume": _parse_int(raw_volume),
            "value_ksh_millions": _parse_float(raw_value),
        }
        seen[tuple(record.items())] = record

    return list(seen.values())
