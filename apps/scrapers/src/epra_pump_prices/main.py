import argparse

from src.epra_pump_prices import PUMP_PRICES_PAGE_URL, scrape
from src.epra_pump_prices.parse import FIELDNAMES
from src.utils.error_tracking import track_errors
from src.utils.output import write_records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--upload", action="store_true", help="upload the CSV via AESOPS_API_KEY")
    parser.add_argument("--dataset-slug", help="upload as a new revision of this existing dataset")
    args = parser.parse_args()

    with track_errors("epra_pump_prices"):
        records = scrape()
        write_records(
            records,
            FIELDNAMES,
            "epra_pump_prices",
            upload=args.upload,
            dataset_name="EPRA Pump Prices",
            description=(
                "Monthly retail (pump) prices per litre for Super (PMS), Diesel (AGO), and "
                "Kerosene (IK) by town, published by the Energy and Petroleum Regulatory "
                "Authority (EPRA) of Kenya. Each row covers one town for one ~monthly price "
                "review period (period_from-period_to). Updated monthly; each upload is the full "
                "history to date, not just the latest period, since the platform reads only the "
                "newest revision of a dataset."
            ),
            license="cc-by-4.0",
            source=PUMP_PRICES_PAGE_URL,
            dataset_slug=args.dataset_slug,
        )


if __name__ == "__main__":
    main()
