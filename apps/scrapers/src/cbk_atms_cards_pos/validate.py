"""Run standalone:  uv run python -m src.cbk_atms_cards_pos.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_atms_cards_pos import fetch_raw
from src.cbk_atms_cards_pos.parse import parse_response

# Hand-verified directly against a raw curl of the page (independent of parse.py), not by
# trusting the scraper's own output.
SPOT_CHECKS = {
    (2009, "July"): {
        "atms": 1581, "atm_cards": 0, "prepaid_cards": 280, "charge_cards": 1679,
        "credit_cards": 108049, "debit_cards": 3280485, "pos_machines": 5063,
        "total_cards": 3390493,
    },
    (2026, "May"): {
        "atms": 2221, "atm_cards": 0, "prepaid_cards": 2080670, "charge_cards": 0,
        "credit_cards": 339603, "debit_cards": 10590915, "pos_machines": 54600,
        "total_cards": 13011188,
    },
}

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 203 rows observed live (Jul 2009 - May 2026, ~203 months) at time of writing; range gives
# headroom for future months without needing to be updated on every scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (180, 500)
REQUIRED_FIELDS = [
    "year", "month", "atms", "atm_cards", "prepaid_cards", "charge_cards",
    "credit_cards", "debit_cards", "pos_machines", "total_cards",
]
CARD_TYPE_FIELDS = ["atm_cards", "prepaid_cards", "charge_cards", "credit_cards", "debit_cards"]


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


def check_total_cards_reconciles(records: list[dict]) -> list[str]:
    """total_cards is the sum of the five card-type columns — a mismatch means a column got
    misaligned during parsing."""
    failures = []
    for r in records:
        expected_total = sum(r[f] for f in CARD_TYPE_FIELDS)
        if expected_total != r["total_cards"]:
            failures.append(
                f"{r['year']}-{r['month']}: total_cards {r['total_cards']} != "
                f"sum of card types {expected_total}"
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
        "total_cards reconciles with card-type sum": check_total_cards_reconciles(records),
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
