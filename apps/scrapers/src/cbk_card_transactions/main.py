import argparse

from src.cbk_card_transactions import TRANSACTIONS_PAGE_URL, scrape
from src.cbk_card_transactions.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_card_transactions"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_card_transactions",
            upload=args.upload,
            dataset_name="CBK Number of Transactions (Payment Cards)",
            description=(
                "Monthly Kenyan payment card transaction counts broken down by card type (ATM, "
                "prepaid, charge, credit, debit) plus POS machine transactions and a total, "
                "published by the Central Bank of Kenya, from July 2009 to date. Companion dataset "
                "to CBK Number of ATMs, ATM Cards & POS Machines (card/machine counts, not "
                "transaction counts). Updated monthly; each upload is the full history to date, "
                "not just the latest month, since the platform reads only the newest revision of "
                "a dataset."
            ),
            license="cc-by-4.0",
            source=TRANSACTIONS_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
