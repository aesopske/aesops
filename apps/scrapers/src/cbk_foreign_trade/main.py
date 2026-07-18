import argparse

from src.cbk_foreign_trade import TRADE_PAGE_URL, scrape
from src.cbk_foreign_trade.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_foreign_trade"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_foreign_trade",
            upload=args.upload,
            dataset_name="CBK Foreign Trade Summary",
            description=(
                "Monthly Kenyan foreign trade summary (commercial and government imports, "
                "domestic and re-export FOB exports, and trade balance, in Ksh Million), "
                "published by the Central Bank of Kenya, from August 1998 to date. Updated "
                "monthly; each upload is the full history to date, not just the latest month, "
                "since the platform reads only the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=TRADE_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
