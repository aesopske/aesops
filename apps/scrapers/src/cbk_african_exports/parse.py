FIELDNAMES = [
    "year",
    "month",
    "uganda",
    "tanzania",
    "zambia",
    "egypt",
    "rwanda",
    "zimbabwe",
    "ethiopia",
    "somalia",
    "south_africa",
    "drc",
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
            raw_uganda,
            raw_tanzania,
            raw_zambia,
            raw_egypt,
            raw_rwanda,
            raw_zimbabwe,
            raw_ethiopia,
            raw_somalia,
            raw_safrica,
            raw_drc,
            raw_other,
            raw_total,
        ) = row

        record = {
            "year": int(raw_year),
            "month": month,
            "uganda": _parse_float(raw_uganda),
            "tanzania": _parse_float(raw_tanzania),
            "zambia": _parse_float(raw_zambia),
            "egypt": _parse_float(raw_egypt),
            "rwanda": _parse_float(raw_rwanda),
            "zimbabwe": _parse_float(raw_zimbabwe),
            "ethiopia": _parse_float(raw_ethiopia),
            "somalia": _parse_float(raw_somalia),
            "south_africa": _parse_float(raw_safrica),
            "drc": _parse_float(raw_drc),
            "other": _parse_float(raw_other),
            "total": _parse_float(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
