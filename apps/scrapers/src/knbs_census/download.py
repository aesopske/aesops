from src.utils.download import download_pdf as _download_pdf

CENSUS_PDF_URL = (
    "https://www.knbs.or.ke/wp-content/uploads/2023/09/"
    "2019-Kenya-population-and-Housing-Census-Volume-1-Population-By-County-And-Sub-County.pdf"
)


def download_pdf(url: str = CENSUS_PDF_URL) -> bytes:
    return _download_pdf(url)
