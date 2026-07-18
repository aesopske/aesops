import requests

from src.cbk_domestic_exports.parse import parse_response

DOMESTIC_EXPORTS_PAGE_URL = "https://www.centralbank.go.ke/value-selected-domestic-exports/"
AJAX_URL = "https://www.centralbank.go.ke/wp-admin/admin-ajax.php"
TABLE_ID = "26"  # "Value of Selected Domestic Exports (Ksh Million)" wpDataTable on
# DOMESTIC_EXPORTS_PAGE_URL

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
    ),
    "Referer": DOMESTIC_EXPORTS_PAGE_URL,
    "X-Requested-With": "XMLHttpRequest",
}

# Standard DataTables server-side-processing POST body. length=-1 requests every row in one
# response (the table's own "Show All entries" option) rather than paginating. 11 columns:
# year, month, Coffee, Tea, Petroleum, Chemicals, Fish, Horticulture, Cement, Other, Total.
_SSP_BODY = {
    "draw": "1",
    "start": "0",
    "length": "-1",
    "search[value]": "",
    "search[regex]": "false",
    "order[0][column]": "0",
    "order[0][dir]": "desc",
    "columns[0][data]": "0",
    "columns[0][searchable]": "true",
    "columns[0][orderable]": "true",
    "columns[1][data]": "1",
    "columns[1][searchable]": "true",
    "columns[1][orderable]": "true",
    "columns[2][data]": "2",
    "columns[2][searchable]": "true",
    "columns[2][orderable]": "true",
    "columns[3][data]": "3",
    "columns[3][searchable]": "true",
    "columns[3][orderable]": "true",
    "columns[4][data]": "4",
    "columns[4][searchable]": "true",
    "columns[4][orderable]": "true",
    "columns[5][data]": "5",
    "columns[5][searchable]": "true",
    "columns[5][orderable]": "true",
    "columns[6][data]": "6",
    "columns[6][searchable]": "true",
    "columns[6][orderable]": "true",
    "columns[7][data]": "7",
    "columns[7][searchable]": "true",
    "columns[7][orderable]": "true",
    "columns[8][data]": "8",
    "columns[8][searchable]": "true",
    "columns[8][orderable]": "true",
    "columns[9][data]": "9",
    "columns[9][searchable]": "true",
    "columns[9][orderable]": "true",
    "columns[10][data]": "10",
    "columns[10][searchable]": "true",
    "columns[10][orderable]": "true",
}


def fetch_raw() -> dict:
    response = requests.post(
        AJAX_URL,
        params={"action": "get_wdtable", "table_id": TABLE_ID},
        headers=_HEADERS,
        data=_SSP_BODY,
        timeout=60,
    )
    response.raise_for_status()
    payload = response.json()
    if "data" not in payload:
        raise ValueError(f"Unexpected response shape from {AJAX_URL}: {payload!r}")
    return payload


def scrape() -> list[dict]:
    return parse_response(fetch_raw())
