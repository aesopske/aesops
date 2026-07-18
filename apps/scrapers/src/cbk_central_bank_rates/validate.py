"""Run standalone:  uv run python -m src.cbk_central_bank_rates.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_central_bank_rates import fetch_raw
from src.cbk_central_bank_rates.parse import parse_response

# Hand-verified directly against a raw curl of the page (independent of parse.py), not by
# trusting the scraper's own output.
SPOT_CHECKS = {
    (1991, "July"): {
        "repo": None, "reverse_repo": 0.0, "interbank_rate": None,
        "tbill_91_day": 17.14, "tbill_182_day": 0.0, "tbill_364_day": 0.0,
        "cash_reserve_requirement": 0.0, "central_bank_rate": 0.0,
    },
    (2016, "July"): {
        "repo": 9.76, "reverse_repo": 10.57, "interbank_rate": 5.88,
        "tbill_91_day": 6.16, "tbill_182_day": 9.79, "tbill_364_day": 10.88,
        "cash_reserve_requirement": 5.25, "central_bank_rate": 10.50,
    },
}

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 301 rows observed live (Jul 1991 - Jul 2016, exactly 301 months) at time of writing. This
# table has not been updated since July 2016 (see NOTES.md) — range is intentionally tight
# rather than open-ended, since a large jump would indicate the source resumed publishing and
# is worth a manual look, not silently absorbed by a generous upper bound.
EXPECTED_RECORD_COUNT_RANGE = (290, 400)
REQUIRED_FIELDS = ["year", "month"]
NUMERIC_FIELDS = [
    "repo", "reverse_repo", "interbank_rate", "tbill_91_day", "tbill_182_day",
    "tbill_364_day", "cash_reserve_requirement", "central_bank_rate",
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
    """Only year/month are required to be non-null — every numeric field is legitimately
    missing for a substantial chunk of this table's early history (see NOTES.md), so null
    numeric fields are expected here, unlike every other CBK dataset in this repo."""
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
    for r in records:
        for field in NUMERIC_FIELDS:
            value = r[field]
            if value is not None and value < 0:
                failures.append(f"{r['year']}-{r['month']}: {field} is negative ({value})")
    return failures


def main() -> None:
    raw = fetch_raw()
    records = parse_response(raw)

    checks = {
        "no duplicate (year, month) keys": check_natural_key_uniqueness(records),
        "spot values match source": check_spot_values(records),
        "year/month never null": check_null_audit(records),
        "record count is plausible": check_record_count(records),
        "all month labels are valid": check_valid_months(records),
        "no negative values": check_non_negative(records),
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
