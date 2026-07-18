import argparse

from src.cbk_central_bank_rates import CBR_PAGE_URL, scrape
from src.cbk_central_bank_rates.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_central_bank_rates"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_central_bank_rates",
            upload=args.upload,
            dataset_name="CBK Central Bank Rates",
            description=(
                "Monthly Kenyan money market rates (%) — repo, reverse repo, interbank rate, "
                "91/182/364-day Treasury bill rates, cash reserve requirement, and the Central "
                "Bank Rate (CBR) — published by the Central Bank of Kenya, from July 1991 to "
                "date. Missing fields (blank or '-' in the source) are left null rather than "
                "coerced to 0. Updated monthly; each upload is the full history to date, not just "
                "the latest month, since the platform reads only the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=CBR_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
