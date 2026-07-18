FIELDNAMES = [
    "year",
    "month",
    "volume_coffee",
    "value_coffee",
    "average_coffee",
    "volume_tea",
    "value_tea",
    "average_tea",
    "volume_hort",
    "value_hort",
    "average_hort",
]


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(payload: dict) -> list[dict]:
    by_key: dict[tuple[int, str], dict] = {}
    for row in payload["data"]:
        (
            raw_year,
            month,
            raw_vol_coffee,
            raw_val_coffee,
            raw_avg_coffee,
            raw_vol_tea,
            raw_val_tea,
            raw_avg_tea,
            raw_vol_hort,
            raw_val_hort,
            raw_avg_hort,
        ) = row

        record = {
            "year": int(raw_year),
            "month": month,
            "volume_coffee": _parse_float(raw_vol_coffee),
            "value_coffee": _parse_float(raw_val_coffee),
            "average_coffee": _parse_float(raw_avg_coffee),
            "volume_tea": _parse_float(raw_vol_tea),
            "value_tea": _parse_float(raw_val_tea),
            "average_tea": _parse_float(raw_avg_tea),
            "volume_hort": _parse_float(raw_vol_hort),
            "value_hort": _parse_float(raw_val_hort),
            "average_hort": _parse_float(raw_avg_hort),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
