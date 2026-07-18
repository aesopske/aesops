import argparse

from src.cbk_cheques_efts import CHEQUES_EFTS_PAGE_URL, scrape
from src.cbk_cheques_efts.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_cheques_efts"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_cheques_efts",
            upload=args.upload,
            dataset_name="CBK Cheques & EFTs",
            description=(
                "Monthly Kenyan automated clearing house volumes and values for credit EFTs "
                "(electronic funds transfers) and debit cheques (Ksh billions), published by the "
                "Central Bank of Kenya, from October 2007 to date. Updated monthly; each upload is "
                "the full history to date, not just the latest month, since the platform reads "
                "only the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=CHEQUES_EFTS_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
