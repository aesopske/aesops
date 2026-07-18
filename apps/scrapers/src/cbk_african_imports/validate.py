"""Run standalone:  uv run python -m src.cbk_african_imports.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_african_imports import fetch_raw
from src.cbk_african_imports.parse import parse_response

# Hand-verified directly against a raw curl of the AJAX endpoint (independent of parse.py),
# not by trusting the scraper's own output.
SPOT_CHECKS = {
    (1998, "September"): {
        "uganda": 2.0, "tanzania": 56.0, "zambia": 21.0, "egypt": 10.0,
        "south_africa": 973.0, "zimbabwe": 19.0, "other": 81.0, "total": 1162.0,
    },
    (2026, "March"): {
        "uganda": 3542.0, "tanzania": 4563.0, "zambia": 896.0, "egypt": 3652.0,
        "south_africa": 7534.0, "zimbabwe": 72.0, "other": 7164.0, "total": 27421.0,
    },
}

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 339 rows observed live (Sep 1998 - Mar 2026, ~331 months) at time of writing; range gives
# headroom for future months without needing to be updated on every scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (300, 700)
REQUIRED_FIELDS = [
    "year", "month", "uganda", "tanzania", "zambia", "egypt",
    "south_africa", "zimbabwe", "other", "total",
]
COUNTRY_FIELDS = ["uganda", "tanzania", "zambia", "egypt", "south_africa", "zimbabwe", "other"]

# January 2002 doesn't reconcile against the sum of the 6 country columns plus "other" (off by
# 23), while every other month in the table matches within ordinary rounding noise (max delta
# 2.0 elsewhere). Hand-verified against a raw curl of the AJAX endpoint — a real, isolated
# source-side quirk, not a parsing bug. See NOTES.md.
KNOWN_NON_RECONCILING_MONTHS = {(2002, "January")}


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
    """total is the sum of the 6 country columns plus "other" — a mismatch means a column got
    misaligned during parsing, except for the known Jan 2002 exception in NOTES.md."""
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
