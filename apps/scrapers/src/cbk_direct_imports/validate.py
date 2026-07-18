"""Run standalone:  uv run python -m src.cbk_direct_imports.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_direct_imports import fetch_raw
from src.cbk_direct_imports.parse import parse_response

# Hand-verified directly against a raw curl of the page (independent of parse.py), not by
# trusting the scraper's own output.
SPOT_CHECKS = {
    (1998, "August"): {
        "food_and_live_animals": 1414.0, "beverages_and_tobacco": 53.0, "crude_materials": 570.0,
        "mineral_fuels": 1928.0, "animal_vegetable_oils": 688.0, "chemicals": 3420.0,
        "manufactured_goods": 1927.0, "machinery_transport": 4481.0, "other": 1041.0,
        "total": 15521.0,
    },
    (2026, "March"): {
        "food_and_live_animals": 26964.0, "beverages_and_tobacco": 1090.0, "crude_materials": 8032.0,
        "mineral_fuels": 91646.0, "animal_vegetable_oils": 12250.0, "chemicals": 43795.0,
        "manufactured_goods": 38216.0, "machinery_transport": 54645.0, "other": 14648.0,
        "total": 291286.0,
    },
}

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 332 rows observed live (Aug 1998 - Mar 2026, ~332 months) at time of writing; range gives
# headroom for future months without needing to be updated on every scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (300, 700)
REQUIRED_FIELDS = [
    "year", "month", "food_and_live_animals", "beverages_and_tobacco", "crude_materials",
    "mineral_fuels", "animal_vegetable_oils", "chemicals", "manufactured_goods",
    "machinery_transport", "other", "total",
]
COMMODITY_FIELDS = [
    "food_and_live_animals", "beverages_and_tobacco", "crude_materials", "mineral_fuels",
    "animal_vegetable_oils", "chemicals", "manufactured_goods", "machinery_transport", "other",
]


def check_natural_key_uniqueness(records: list[dict]) -> list[str]:
    counts = Counter((r["year"], r["month"]) for r in records)
    dupes = [k for k, n in counts.items() if n > 1]
    return [f"duplicate (year, month) key: {k}" for k in dupes]


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key = {(r["year"], r["month"]): r for r in records}
    for key, expected in SPOT_CHECKS.items():
        actual = by_key.get(key)
        if actual is None:
            failures.append(f"{key}: no matching record found")
            continue
        for field, expected_value in expected.items():
            if actual[field] != expected_value:
                failures.append(f"{key}.{field}: expected {expected_value!r}, got {actual[field]!r}")
    return failures


def check_null_audit(records: list[dict]) -> list[str]:
    failures = []
    for row in records:
        for field in REQUIRED_FIELDS:
            if row[field] is None:
                failures.append(f"{row}: {field} is unexpectedly None")
    return failures


def check_record_count(records: list[dict]) -> list[str]:
    low, high = EXPECTED_RECORD_COUNT_RANGE
    if not (low <= len(records) <= high):
        return [f"expected {low}-{high} records, got {len(records)}"]
    return []


def check_valid_months(records: list[dict]) -> list[str]:
    bad = {r["month"] for r in records if r["month"] not in VALID_MONTHS}
    return [f"unrecognized month label: {m!r}" for m in sorted(bad)]


def check_non_negative(records: list[dict]) -> list[str]:
    failures = []
    numeric_fields = [f for f in REQUIRED_FIELDS if f not in ("year", "month")]
    for r in records:
        for field in numeric_fields:
            if r[field] < 0:
                failures.append(f"{r['year']}-{r['month']}: {field} is negative ({r[field]})")
    return failures


def check_total_reconciles(records: list[dict]) -> list[str]:
    """total is the sum of the nine commodity columns — a mismatch means a column got
    misaligned during parsing. This table reconciles cleanly for every observed row (max delta
    3.0), with no known exceptions."""
    failures = []
    for r in records:
        expected_total = sum(r[f] for f in COMMODITY_FIELDS)
        if abs(expected_total - r["total"]) > 5:
            failures.append(
                f"{r['year']}-{r['month']}: total {r['total']} != "
                f"sum of commodities {expected_total}"
            )
    return failures


def main() -> None:
    raw = fetch_raw()
    records = parse_response(raw)

    checks = {
        "no duplicate (year, month) keys": check_natural_key_uniqueness(records),
        "spot values match source": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record count is plausible": check_record_count(records),
        "all month labels are valid": check_valid_months(records),
        "no negative values": check_non_negative(records),
        "total reconciles with commodity sum": check_total_reconciles(records),
    }

    all_passed = True
    for name, failures in checks.items():
        if failures:
            all_passed = False
            print(f"FAIL: {name} ({len(failures)} issue(s))")
            for failure in failures[:10]:
                print(f"  - {failure}")
            if len(failures) > 10:
                print(f"  ... and {len(failures) - 10} more")
        else:
            print(f"PASS: {name}")

    sys.exit(0 if all_passed else 1)


if __name__ == "__main__":
    main()
