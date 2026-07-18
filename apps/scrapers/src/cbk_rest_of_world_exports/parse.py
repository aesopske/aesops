FIELDNAMES = [
    "year",
    "month",
    "uk",
    "germany",
    "usa",
    "netherlands",
    "uganda",
    "tanzania",
    "pakistan",
    "france",
    "egypt",
    "belgium",
    "others",
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
            raw_uk,
            raw_germany,
            raw_usa,
            raw_netherlands,
            raw_uganda,
            raw_tanzania,
            raw_pakistan,
            raw_france,
            raw_egypt,
            raw_belgium,
            raw_others,
            raw_total,
        ) = row

        record = {
            "year": int(raw_year),
            "month": month,
            "uk": _parse_float(raw_uk),
            "germany": _parse_float(raw_germany),
            "usa": _parse_float(raw_usa),
            "netherlands": _parse_float(raw_netherlands),
            "uganda": _parse_float(raw_uganda),
            "tanzania": _parse_float(raw_tanzania),
            "pakistan": _parse_float(raw_pakistan),
            "france": _parse_float(raw_france),
            "egypt": _parse_float(raw_egypt),
            "belgium": _parse_float(raw_belgium),
            "others": _parse_float(raw_others),
            "total": _parse_float(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
