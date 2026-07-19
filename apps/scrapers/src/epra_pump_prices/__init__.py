import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from src.epra_pump_prices.parse import parse_response

PUMP_PRICES_PAGE_URL = "https://www.epra.go.ke/pump-prices"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
    ),
}

# EPRA's site has been observed to hang the initial TCP connect (not just respond
# slowly) from GitHub Actions runners specifically — reachable fine from other
# networks, so this looks like intermittent throttling of GH's IP ranges rather
# than a real outage. Retries with backoff ride out the transient case; a
# persistent block still needs a re-run (a fresh runner gets a fresh IP).
def _session_with_retries() -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=4,
        connect=4,
        backoff_factor=5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
    )
    session.mount("https://", HTTPAdapter(max_retries=retry))
    return session


def fetch_raw() -> str:
    response = _session_with_retries().get(PUMP_PRICES_PAGE_URL, headers=_HEADERS, timeout=60)
    response.raise_for_status()
    return response.text


def scrape() -> list[dict]:
    return parse_response(fetch_raw())
