import argparse

from src.cbk_dfcc import DFCC_PAGE_URL, scrape
from src.cbk_dfcc.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_dfcc"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_dfcc",
            upload=args.upload,
            dataset_name="CBK Domestic Foreign Currency Cheques",
            description=(
                "Monthly Kenyan automated clearing house volumes and values for domestic foreign "
                "currency cheques (DFCC) denominated in USD, EUR, and GBP, published by the "
                "Central Bank of Kenya, from August 2011 to date. Updated monthly; each upload is "
                "the full history to date, not just the latest month, since the platform reads "
                "only the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=DFCC_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
