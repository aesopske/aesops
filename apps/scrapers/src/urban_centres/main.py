import argparse

from src.urban_centres import CENSUS_VOL2_PDF_URL, scrape
from src.utils.error_tracking import track_errors
from src.utils.output import write_records

FIELDNAMES = ["urban_centre", "county", "total", "male", "female"]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("urban_centres"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "knbs_2019_urban_centres",
            upload=args.upload,
            dataset_name="KNBS 2019 Urban Centres Population",
            description="Population by urban centre, sex, and county — 2019 Kenya Population and Housing Census, Volume II, Table 2.5.",
            license="cc-by-4.0",
            source=CENSUS_VOL2_PDF_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
