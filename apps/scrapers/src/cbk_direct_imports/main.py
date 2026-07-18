import argparse

from src.cbk_direct_imports import DIRECT_IMPORTS_PAGE_URL, scrape
from src.cbk_direct_imports.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_direct_imports"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_direct_imports",
            upload=args.upload,
            dataset_name="CBK Value of Direct Imports Per Commodities",
            description=(
                "Monthly Kenyan direct import values (Ksh Million) by SITC-style commodity "
                "category — food and live animals, beverages and tobacco, crude materials, "
                "mineral fuels, animal/vegetable oils, chemicals, manufactured goods, machinery "
                "and transport equipment, other — plus a total, published by the Central Bank of "
                "Kenya, from August 1998 to date. Updated monthly; each upload is the full "
                "history to date, not just the latest month, since the platform reads only the "
                "newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=DIRECT_IMPORTS_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
