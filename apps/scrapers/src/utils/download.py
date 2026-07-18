import requests
import truststore

# KNBS's server doesn't send its intermediate cert in the TLS handshake (verified via
# `openssl s_client -showcerts`); requests/certifi can't complete the chain, but the OS
# trust store can (it does AIA chasing). truststore patches ssl.SSLContext to use the OS
# store instead, which is more broadly useful than special-casing this one server.
truststore.inject_into_ssl()

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36"
    ),
    "Referer": "https://www.knbs.or.ke/reports/kenya-census-2019/",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def download_pdf(url: str) -> bytes:
    response = requests.get(url, headers=_HEADERS, timeout=60)
    response.raise_for_status()
    if not response.content:
        raise ValueError(f"Downloaded empty PDF from {url}")
    return response.content
