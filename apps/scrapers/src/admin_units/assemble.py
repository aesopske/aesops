"""Turns the flat, ordered list of parsed rows (each tagged with its hierarchy level and its
own raw values) into full records carrying their ancestry — the same "track current parent
while iterating" approach as knbs_census's merge.py, extended from 2 tracked levels to 5."""

from src.admin_units.parse import NEGLIGIBLE, NIL

LEVEL_ORDER = ["national", "county", "subcounty", "division", "location", "sublocation"]
# The record fields that carry ancestry, in the same order as LEVEL_ORDER[1:].
ANCESTRY_FIELDS = ["county", "subcounty", "division", "location"]

NUMERIC_FIELDS = [
    "total",
    "male",
    "female",
    "households_total",
    "households_conventional",
    "households_group_quarters",
    "land_area_sq_km",
    "population_density",
]


def _parse_number(raw: str | None) -> int | float | None:
    if raw is None:
        return None
    if raw == NIL:
        return 0
    if raw == NEGLIGIBLE:
        return None
    digits_and_dot = raw.replace(",", "")
    if "." not in digits_and_dot:
        return int(digits_and_dot)
    whole, _sep, frac = digits_and_dot.rpartition(".")
    return float(f"{whole.replace('.', '')}.{frac}")


def assemble_records(rows: list[dict]) -> list[dict]:
    ancestry = dict.fromkeys(ANCESTRY_FIELDS)
    records = []

    for row in rows:
        depth = LEVEL_ORDER.index(row["level"])

        # A row at level N replaces the tracked value at that level and invalidates every
        # deeper one (a new county means the previous county's subcounty/division/location
        # trackers no longer apply).
        for field_depth, field in enumerate(ANCESTRY_FIELDS, start=1):
            if field_depth == depth:
                ancestry[field] = row["name"]
            elif field_depth > depth:
                ancestry[field] = None

        record = {
            "county": ancestry["county"],
            "subcounty": ancestry["subcounty"],
            "division": ancestry["division"],
            "location": ancestry["location"],
            "sublocation": row["name"] if row["level"] == "sublocation" else None,
        }
        for field in NUMERIC_FIELDS:
            record[field] = _parse_number(row["raw"][field])
        records.append(record)

    return records
