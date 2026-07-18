"""Run standalone:  uv run python -m src.cbk_domestic_exports.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_domestic_exports import fetch_raw
from src.cbk_domestic_exports.parse import parse_response

# Hand-verified directly against a raw curl of the AJAX endpoint (independent of parse.py),
# not by trusting the scraper's own output.
SPOT_CHECKS = {
    (1998, "August"): {
        "coffee": 500.47, "tea": 2404.70, "petroleum": 850.60, "chemicals": 695.15,
        "fish": 183.19, "horticulture": 854.04, "cement": 117.68, "other": 3543.33,
        "total": 9149.16,
    },
    (2026, "March"): {
        "coffee": 6919.92, "tea": 15287.30, "petroleum": 1642.99, "chemicals": 6520.92,
        "fish": 564.89, "horticulture": 16068.66, "cement": 264.68, "other": 44310.57,
        "total": 91579.94,
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
    "year", "month", "coffee", "tea", "petroleum", "chemicals", "fish",
    "horticulture", "cement", "other", "total",
]
COMMODITY_FIELDS = [
    "coffee", "tea", "petroleum", "chemicals", "fish", "horticulture", "cement", "other",
]

# Every month of 2018 has some mismatch between `total` and the sum of the 8 commodity columns
# — ranging from negligible (Jan: 0.01) to large (Mar: 5,127.95) — while every other year in the
# table reconciles within ordinary rounding (max delta elsewhere is exactly 1.0, at 2014-12).
# Hand-verified against a raw curl of the AJAX endpoint — a real source-side data quirk confined
# to this one year, not a parsing bug. See NOTES.md.
KNOWN_NON_RECONCILING_MONTHS = {(2018, month) for month in (
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
)}


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
    """total is the sum of the eight commodity columns — a mismatch means a column got
    misaligned during parsing, except for the known 2018 exception documented in NOTES.md."""
    failures = []
    for r in records:
        if (r["year"], r["month"]) in KNOWN_NON_RECONCILING_MONTHS:
            continue
        expected_total = sum(r[f] for f in COMMODITY_FIELDS)
        # Ordinary rounding noise outside 2018 tops out at exactly 1.0 (2014-12); 1.5 is a safe
        # margin above that.
        if abs(expected_total - r["total"]) > 1.5:
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
