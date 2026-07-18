import argparse

from src.cbk_annual_gdp import GDP_PAGE_URL, scrape
from src.utils.error_tracking import track_errors
from src.utils.output import write_records

FIELDNAMES = ["year", "nominal_gdp_prices", "real_gdp_growth", "real_gdp_prices"]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_annual_gdp"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_annual_gdp",
            upload=args.upload,
            dataset_name="CBK Annual GDP",
            description=(
                "Annual Kenyan GDP figures (nominal and real, at current and constant prices, "
                "in Ksh Million) and year-on-year real GDP growth, published by the Central Bank "
                "of Kenya. Updated yearly; each upload is the full history to date, not just the "
                "latest year, since the platform reads only the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=GDP_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
