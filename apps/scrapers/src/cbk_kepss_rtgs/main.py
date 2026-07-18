import argparse

from src.cbk_kepss_rtgs import KEPSS_RTGS_PAGE_URL, scrape
from src.cbk_kepss_rtgs.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("cbk_kepss_rtgs"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "cbk_kepss_rtgs",
            upload=args.upload,
            dataset_name="CBK KEPSS/RTGS",
            description=(
                "Monthly Kenyan Electronic Payment and Settlement System (KEPSS) real-time gross "
                "settlement (RTGS) volume and value (Ksh Millions), published by the Central Bank "
                "of Kenya, from August 2005 to date. Updated monthly; each upload is the full "
                "history to date, not just the latest month, since the platform reads only the "
                "newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=KEPSS_RTGS_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
