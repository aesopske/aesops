import io

import pdfplumber

from src.knbs_census.download import download_pdf
from src.knbs_census.merge import merge_tables
from src.knbs_census.parse import parse_table_2_5, parse_table_2_6, parse_table_2_7


def scrape() -> list[dict]:
    pdf_bytes = download_pdf()
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        table_2_5 = parse_table_2_5(pdf)
        table_2_6 = parse_table_2_6(pdf)
        table_2_7 = parse_table_2_7(pdf)
    return merge_tables(table_2_5, table_2_6, table_2_7)
