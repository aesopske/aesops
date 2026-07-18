FIELDNAMES = [
    "year",
    "month",
    "usd_value",
    "usd_volume",
    "euro_value",
    "euro_volume",
    "gbp_value",
    "gbp_volume",
]


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(payload: dict) -> list[dict]:
    # (year, month) is not a reliable dedup key here — the source has published a genuine
    # conflicting duplicate for a real (year, month), same as cbk_weighted_average_rates (see
    # NOTES.md, "2024-01"). Deduping on the *full* record instead drops harmless exact-duplicate
    # rows while preserving both sides of a genuine conflict rather than silently discarding one.
    seen: dict[tuple, dict] = {}
    for row in payload["data"]:
        (
            raw_year,
            month,
            raw_usd_value,
            raw_usd_volume,
            raw_euro_value,
            raw_euro_volume,
            raw_gbp_value,
            raw_gbp_volume,
        ) = row

        record = {
            "year": int(raw_year),
            "month": month,
            "usd_value": _parse_float(raw_usd_value),
            "usd_volume": _parse_float(raw_usd_volume),
            "euro_value": _parse_float(raw_euro_value),
            "euro_volume": _parse_float(raw_euro_volume),
            "gbp_value": _parse_float(raw_gbp_value),
            "gbp_volume": _parse_float(raw_gbp_volume),
        }
        seen[tuple(record.items())] = record

    return list(seen.values())
