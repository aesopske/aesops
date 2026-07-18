FIELDNAMES = [
    "year",
    "month",
    "coffee",
    "tea",
    "petroleum",
    "chemicals",
    "fish",
    "horticulture",
    "cement",
    "other",
    "total",
]


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(payload: dict) -> list[dict]:
    by_key: dict[tuple[int, str], dict] = {}
    for row in payload["data"]:
        (
            raw_year,
            month,
            raw_coffee,
            raw_tea,
            raw_petroleum,
            raw_chemicals,
            raw_fish,
            raw_horticulture,
            raw_cement,
            raw_other,
            raw_total,
        ) = row

        record = {
            "year": int(raw_year),
            "month": month,
            "coffee": _parse_float(raw_coffee),
            "tea": _parse_float(raw_tea),
            "petroleum": _parse_float(raw_petroleum),
            "chemicals": _parse_float(raw_chemicals),
            "fish": _parse_float(raw_fish),
            "horticulture": _parse_float(raw_horticulture),
            "cement": _parse_float(raw_cement),
            "other": _parse_float(raw_other),
            "total": _parse_float(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
