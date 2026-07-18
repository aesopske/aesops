FIELDNAMES = [
    "year",
    "month",
    "uk",
    "usa",
    "germany",
    "italy",
    "uae",
    "saudi_arabia",
    "france",
    "india",
    "south_africa",
    "japan",
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
            raw_usa,
            raw_germany,
            raw_italy,
            raw_uae,
            raw_sarabia,
            raw_france,
            raw_india,
            raw_safrica,
            raw_japan,
            raw_others,
            raw_total,
        ) = row

        record = {
            "year": int(raw_year),
            "month": month,
            "uk": _parse_float(raw_uk),
            "usa": _parse_float(raw_usa),
            "germany": _parse_float(raw_germany),
            "italy": _parse_float(raw_italy),
            "uae": _parse_float(raw_uae),
            "saudi_arabia": _parse_float(raw_sarabia),
            "france": _parse_float(raw_france),
            "india": _parse_float(raw_india),
            "south_africa": _parse_float(raw_safrica),
            "japan": _parse_float(raw_japan),
            "others": _parse_float(raw_others),
            "total": _parse_float(raw_total),
        }
        key = (record["year"], record["month"])
        existing = by_key.get(key)
        if existing is not None and existing != record:
            raise ValueError(f"Conflicting rows for {key}: {existing} vs {record}")
        by_key[key] = record

    return list(by_key.values())
