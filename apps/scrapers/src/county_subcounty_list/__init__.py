import io

import pdfplumber

from src.county_subcounty_list.parse import parse_table
from src.utils.download import download_pdf

CENSUS_VOL2_PDF_URL = (
    "https://www.knbs.or.ke/wp-content/uploads/2023/09/"
    "2019-Kenya-population-and-Housing-Census-Volume-2-Distribution-of-Population-by-"
    "Administrative-Units.pdf"
)


def scrape() -> list[dict]:
    pdf_bytes = download_pdf(CENSUS_VOL2_PDF_URL)
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        return parse_table(pdf)
