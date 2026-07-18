import argparse

from src.cbk_rest_of_world_exports import ROW_EXPORTS_PAGE_URL, scrape
from src.cbk_rest_of_world_exports.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_rest_of_world_exports"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_rest_of_world_exports",
            upload=args.upload,
            dataset_name="CBK Value of Exports to Selected Rest of World Countries",
            description=(
                "Monthly Kenyan export values (Ksh Million) to selected rest-of-world countries — "
                "UK, Germany, USA, Netherlands, Uganda, Tanzania, Pakistan, France, Egypt, "
                "Belgium — plus Others and a total, published by the Central Bank of Kenya, from "
                "September 1998 to date. Updated monthly; each upload is the full history to "
                "date, not just the latest month, since the platform reads only the newest "
                "revision of a dataset."
            ),
            license="cc-by-4.0",
            source=ROW_EXPORTS_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
