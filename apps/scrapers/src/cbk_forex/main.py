import argparse

from src.cbk_forex import FOREX_PAGE_URL, scrape
from src.utils.error_tracking import track_errors
from src.utils.output import write_records

FIELDNAMES = ["date", "currency", "exchange_rate"]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_forex"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_forex_rates",
            upload=args.upload,
            dataset_name="CBK Forex Rates",
            description=(
                "Daily indicative KES exchange rates against major and regional currencies, "
                "published by the Central Bank of Kenya. Refreshed daily; each upload is the "
                "full history to date, not just the latest day, since the platform reads only "
                "the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=FOREX_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
