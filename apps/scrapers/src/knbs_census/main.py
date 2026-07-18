import argparse

from src.knbs_census import scrape
from src.knbs_census.download import CENSUS_PDF_URL
from src.utils.error_tracking import track_errors
from src.utils.output import write_records

FIELDNAMES = [
    "county",
    "sub_county",
    "male",
    "female",
    "intersex",
    "population",
    "number_of_households",
    "average_household_size",
    "land_area_sq_km",
    "population_density",
]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("knbs_census"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "2019_population_by_subcounty",
            upload=args.upload,
            dataset_name="2019 Population by County and Sub-County",
            description=(
                "Population by sex, households, average household size, land area, and "
                "population density, by county and sub-county — 2019 Kenya Population and "
                "Housing Census, Volume I."
            ),
            license="cc-by-4.0",
            source=CENSUS_PDF_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
