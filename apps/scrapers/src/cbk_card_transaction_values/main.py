import argparse

from src.cbk_card_transaction_values import TRANSACTION_VALUES_PAGE_URL, scrape
from src.cbk_card_transaction_values.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_card_transaction_values"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_card_transaction_values",
            upload=args.upload,
            dataset_name="CBK Value of Transactions (Payment Cards, Ksh Millions)",
            description=(
                "Monthly Kenyan payment card transaction values (Ksh Millions) broken down by "
                "card type (ATM, prepaid, charge, credit, debit) plus POS machine transactions and "
                "a total, published by the Central Bank of Kenya, from July 2009 to date. "
                "Companion dataset to CBK Number of Transactions (Payment Cards) — this is value, "
                "not count, of transactions. Updated monthly; each upload is the full history to "
                "date, not just the latest month, since the platform reads only the newest "
                "revision of a dataset."
            ),
            license="cc-by-4.0",
            source=TRANSACTION_VALUES_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
