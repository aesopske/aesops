"""Run standalone:  uv run python -m src.cbk_foreign_trade.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_foreign_trade import fetch_raw
from src.cbk_foreign_trade.parse import parse_response

# Hand-verified directly against a raw curl of the page (independent of parse.py), not by
# trusting the scraper's own output.
SPOT_CHECKS = {
    (1998, "August"): {
        "commercial_imports": 14_786.66,
        "government_imports": 736.34,
        "total_imports": 15_522.99,
        "domestic_fob": 8_642.42,
        "re_exports": 506.74,
        "total_exports_fob": 9_149.16,
        "trade_balance": -6_373.83,
    },
    (2026, "March"): {
        "commercial_imports": 289_153.01,
        "government_imports": 2_132.99,
        "total_imports": 291_286.00,
        "domestic_fob": 91_579.94,
        "re_exports": 36_110.91,
        "total_exports_fob": 127_690.85,
        "trade_balance": -163_595.15,
    },
}

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 330 rows observed live (Aug 1998 - Mar 2026, ~331 months) at time of writing; range gives
# headroom for future months without needing to be updated on every scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (300, 800)
REQUIRED_FIELDS = [
    "year", "month", "commercial_imports", "government_imports", "total_imports",
    "domestic_fob", "re_exports", "total_exports_fob", "trade_balance",
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


def check_totals_reconcile(records: list[dict]) -> list[str]:
    """total_imports and total_exports_fob are sums of their two components; trade_balance
    is exports minus imports. A mismatch means a column got misaligned during parsing."""
    failures = []
    for r in records:
        expected_imports = round(r["commercial_imports"] + r["government_imports"], 2)
        expected_exports = round(r["domestic_fob"] + r["re_exports"], 2)
        expected_balance = round(r["total_exports_fob"] - r["total_imports"], 2)
        if abs(expected_imports - r["total_imports"]) > 0.05:
            failures.append(
                f"{r['year']}-{r['month']}: total_imports {r['total_imports']} != "
                f"commercial+government {expected_imports}"
            )
        if abs(expected_exports - r["total_exports_fob"]) > 0.05:
            failures.append(
                f"{r['year']}-{r['month']}: total_exports_fob {r['total_exports_fob']} != "
                f"domestic_fob+re_exports {expected_exports}"
            )
        if abs(expected_balance - r["trade_balance"]) > 0.05:
            failures.append(
                f"{r['year']}-{r['month']}: trade_balance {r['trade_balance']} != "
                f"total_exports_fob-total_imports {expected_balance}"
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
        "totals reconcile with components": check_totals_reconcile(records),
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
