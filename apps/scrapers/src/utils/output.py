import csv
import json
from pathlib import Path

from src.utils.upload import UploadNotConfigured, upload_dataset

OUTPUT_DIR = Path(__file__).parent.parent.parent / "output"


def write_records(
    records: list[dict],
    fieldnames: list[str],
    name: str,
    *,
    upload: bool = False,
    dataset_name: str | None = None,
    description: str | None = None,
    license: str | None = None,
    source: str | None = None,
    dataset_slug: str | None = None,
) -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)

    json_path = OUTPUT_DIR / f"{name}.json"
    json_path.write_text(json.dumps(records, indent=2))

    csv_path = OUTPUT_DIR / f"{name}.csv"
    with csv_path.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    print(f"Parsed {len(records)} records")
    print(f"Wrote {json_path} and {csv_path}")

    if not upload:
        return
    try:
        result = upload_dataset(
            csv_path,
            name=dataset_name or name,
            description=description,
            license=license,
            source=source,
            dataset_slug=dataset_slug,
        )
    except UploadNotConfigured as e:
        print(f"Skipped upload: {e}")
        return
    print(f"Uploaded: {result}")
