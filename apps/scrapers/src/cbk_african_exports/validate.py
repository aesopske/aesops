"""Run standalone:  uv run python -m src.cbk_african_exports.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_african_exports import fetch_raw
from src.cbk_african_exports.parse import parse_response

# Hand-verified directly against a raw curl of the AJAX endpoint (independent of parse.py),
# not by trusting the scraper's own output.
SPOT_CHECKS = {
    (1998, "September"): {
        "uganda": 1809.0, "tanzania": 1534.0, "zambia": 19.0, "egypt": 410.0,
        "rwanda": 326.0, "zimbabwe": 71.0, "ethiopia": 119.0, "somalia": 195.0,
        "south_africa": 83.0, "drc": 86.0, "other": 511.0, "total": 5163.0,
    },
    (2026, "February"): {
        "uganda": 39072.0, "tanzania": 5474.0, "zambia": 862.0, "egypt": 3235.0,
        "rwanda": 3418.0, "zimbabwe": 444.0, "ethiopia": 1240.0, "somalia": 966.0,
        "south_africa": 933.0, "drc": 4119.0, "other": 11609.0, "total": 71372.0,
    },
}

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 339 rows observed live (Sep 1998 - Feb 2026, ~330 months) at time of writing; range gives
# headroom for future months without needing to be updated on every scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (300, 700)
REQUIRED_FIELDS = [
    "year", "month", "uganda", "tanzania", "zambia", "egypt", "rwanda", "zimbabwe",
    "ethiopia", "somalia", "south_africa", "drc", "other", "total",
]
COUNTRY_FIELDS = [
    "uganda", "tanzania", "zambia", "egypt", "rwanda", "zimbabwe",
    "ethiopia", "somalia", "south_africa", "drc", "other",
]

# November and December 2018 don't reconcile against the sum of the 11 country/"other" columns
# (off by ~495-497), while every other month in the table (including the rest of 2018) matches
# within ordinary rounding noise (max delta 3.0 elsewhere). Hand-verified against a raw curl of
# the AJAX endpoint — a real, isolated source-side quirk, not a parsing bug. See NOTES.md.
KNOWN_NON_RECONCILING_MONTHS = {(2018, "November"), (2018, "December")}


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
    """total is the sum of the 10 country columns plus "other" — a mismatch means a column got
    misaligned during parsing, except for the known Nov/Dec 2018 exception in NOTES.md."""
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
