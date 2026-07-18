import argparse

from src.county_subcounty_list import CENSUS_VOL2_PDF_URL, scrape
from src.utils.error_tracking import track_errors
from src.utils.output import write_records

FIELDNAMES = ["county_code", "county_name", "subcounty_code", "subcounty_name"]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("county_subcounty_list"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "knbs_2019_county_subcounty_list",
            upload=args.upload,
            dataset_name="KNBS 2019 County and Sub-County Code List",
            description="Canonical county and sub-county code reference list — 2019 Kenya Population and Housing Census, Volume II, Table 1.2.",
            license="cc-by-4.0",
            source=CENSUS_VOL2_PDF_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
