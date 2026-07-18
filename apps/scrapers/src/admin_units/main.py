import argparse

from src.admin_units import CENSUS_VOL2_PDF_URL, scrape
from src.utils.error_tracking import track_errors
from src.utils.output import write_records

FIELDNAMES = [
    "county",
    "subcounty",
    "division",
    "location",
    "sublocation",
    "total",
    "male",
    "female",
    "households_total",
    "households_conventional",
    "households_group_quarters",
    "land_area_sq_km",
    "population_density",
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("admin_units"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "knbs_2019_admin_units",
            upload=args.upload,
            dataset_name="2019 Population by Sub-Location",
            description=(
                "Population by sex, households, land area, and population density down to "
                "sub-location — the finest administrative granularity published — 2019 Kenya "
                "Population and Housing Census, Volume II, Table 2.4."
            ),
            license="cc-by-4.0",
            source=CENSUS_VOL2_PDF_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
