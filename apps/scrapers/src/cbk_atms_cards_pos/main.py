import argparse

from src.cbk_atms_cards_pos import ATMS_CARDS_POS_PAGE_URL, scrape
from src.cbk_atms_cards_pos.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_atms_cards_pos"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_atms_cards_pos",
            upload=args.upload,
            dataset_name="CBK Number of ATMs, ATM Cards & POS Machines",
            description=(
                "Monthly Kenyan payment infrastructure counts — ATMs, POS machines, and cards in "
                "circulation broken down by type (ATM, prepaid, charge, credit, debit) plus a "
                "total cards figure — published by the Central Bank of Kenya, from July 2009 to "
                "date. Updated monthly; each upload is the full history to date, not just the "
                "latest month, since the platform reads only the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=ATMS_CARDS_POS_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
