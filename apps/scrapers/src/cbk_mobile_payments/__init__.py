import requests

from src.cbk_mobile_payments.parse import parse_response

MOBILE_PAYMENTS_PAGE_URL = "https://www.centralbank.go.ke/national-payments-system/mobile-payments/"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
    ),
}


def fetch_raw() -> str:
    response = requests.get(MOBILE_PAYMENTS_PAGE_URL, headers=_HEADERS, timeout=60)
    response.raise_for_status()
    return response.text


def scrape() -> list[dict]:
    return parse_response(fetch_raw())
