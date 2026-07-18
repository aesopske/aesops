"""Run standalone:  uv run python -m src.cbk_rest_of_world_imports.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_rest_of_world_imports import fetch_raw
from src.cbk_rest_of_world_imports.parse import parse_response

# Hand-verified directly against a raw curl of the AJAX endpoint (independent of parse.py),
# not by trusting the scraper's own output.
SPOT_CHECKS = {
    (1998, "September"): {
        "uk": 1958.0, "usa": 375.0, "germany": 957.0, "italy": 408.0, "uae": 1333.0,
        "saudi_arabia": 1024.0, "france": 669.0, "india": 825.0, "south_africa": 973.0,
        "japan": 2470.0, "others": 6526.0, "total": 16949.0,
    },
    (2026, "January"): {
        "uk": 3299.0, "usa": 9494.0, "germany": 3183.0, "italy": 2689.0, "uae": 22992.0,
        "saudi_arabia": 13502.0, "france": 1823.0, "india": 30992.0, "south_africa": 6484.0,
        "japan": 10678.0, "others": 171641.0, "total": 276778.0,
    },
}

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 339 rows observed live (Sep 1998 - Jan 2026, ~331 months) at time of writing; range gives
# headroom for future months without needing to be updated on every scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (300, 700)
REQUIRED_FIELDS = [
    "year", "month", "uk", "usa", "germany", "italy", "uae", "saudi_arabia",
    "france", "india", "south_africa", "japan", "others", "total",
]
COUNTRY_FIELDS = [
    "uk", "usa", "germany", "italy", "uae", "saudi_arabia",
    "france", "india", "south_africa", "japan", "others",
]

# Every month of 1998 and 1999 (24 months total) doesn't reconcile against the sum of the 11
# country/"others" columns — deltas of 462 or more, while every month from 2000 onward matches
# within ordinary rounding noise (max delta 3.0). Hand-verified against a raw curl of the AJAX
# endpoint — a real, isolated-to-this-window source-side quirk, not a parsing bug. See NOTES.md.
KNOWN_NON_RECONCILING_MONTHS = {
    (year, month)
    for year in (1998, 1999)
    for month in (
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    )
}


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
    """total is the sum of the 10 country columns plus "others" — a mismatch means a column
    got misaligned during parsing, except for the known 1998-1999 exception in NOTES.md."""
    failures = []
    for r in records:
        if (r["year"], r["month"]) in KNOWN_NON_RECONCILING_MONTHS:
            continue
        expected_total = sum(r[f] for f in COUNTRY_FIELDS)
        if abs(expected_total - r["total"]) > 5:
            failures.append(
                f"{r['year']}-{r['month']}: total {r['total']} != "
                f"sum of countries {expected_total}"
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
        "total reconciles with country sum": check_total_reconciles(records),
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
