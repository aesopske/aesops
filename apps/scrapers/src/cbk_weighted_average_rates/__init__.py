import requests

from src.cbk_weighted_average_rates.parse import parse_response

RATES_PAGE_URL = "https://www.centralbank.go.ke/commercial-banks-weighted-average-rates/"
AJAX_URL = "https://www.centralbank.go.ke/wp-admin/admin-ajax.php"
TABLE_ID = "17"  # "Commercial Banks Weighted Average Rates (%)" wpDataTable on RATES_PAGE_URL

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
    ),
    "Referer": RATES_PAGE_URL,
    "X-Requested-With": "XMLHttpRequest",
}

# Standard DataTables server-side-processing POST body. length=-1 requests every row in one
# response (the table's own "Show All entries" option) rather than paginating.
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
