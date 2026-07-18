import argparse

from src.cbk_rest_of_world_imports import ROW_IMPORTS_PAGE_URL, scrape
from src.cbk_rest_of_world_imports.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_rest_of_world_imports"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_rest_of_world_imports",
            upload=args.upload,
            dataset_name="CBK Value of Direct Imports from Selected Rest of World Countries",
            description=(
                "Monthly Kenyan direct import values (Ksh Million) from selected "
                "rest-of-world countries — UK, USA, Germany, Italy, UAE, Saudi Arabia, "
                "France, India, South Africa, Japan — plus Others and a total, published by "
                "the Central Bank of Kenya, from September 1998 to date. Updated monthly; "
                "each upload is the full history to date, not just the latest month, since "
                "the platform reads only the newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=ROW_IMPORTS_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
