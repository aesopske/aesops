"""Run standalone:  uv run python -m src.cbk_forex.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_forex import fetch_raw
from src.cbk_forex.parse import parse_response

# Hand-verified directly against a raw curl of the AJAX endpoint (independent of parse.py),
# not by trusting the scraper's own output.
SPOT_CHECKS = {
    ("2026-07-17", "US DOLLAR"): 129.3000,
    ("2026-07-17", "EURO"): 148.1400,
    ("2024-01-05", "AUSTRALIAN $"): 106.0780,
}

# 21 currencies observed live; the table's earliest date is 2024-01-05, so the count grows by
# ~21/day. Lower bound covers the known history at time of writing; upper bound is generous
# headroom rather than a tight guess pulled from the parser's own output.
EXPECTED_RECORD_COUNT_RANGE = (13_000, 50_000)
REQUIRED_FIELDS = ["date", "currency", "exchange_rate"]


def check_recordstotal_matches(records: list[dict], raw: dict) -> list[str]:
    """No parent/child hierarchy in this dataset (flat currency-rate rows), so the
    cross-reference here is against the server's own independently-reported `recordsTotal`,
    checked before dedup removes the known duplicate day."""
    raw_count = len(raw["data"])
    reported = int(raw["recordsTotal"])
    if raw_count != reported:
        return [f"raw response has {raw_count} rows but recordsTotal says {reported}"]
    return []


def check_natural_key_uniqueness(records: list[dict]) -> list[str]:
    counts = Counter((r["date"], r["currency"]) for r in records)
    dupes = [k for k, n in counts.items() if n > 1]
    return [f"duplicate (date, currency) key: {k}" for k in dupes]


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key = {(r["date"], r["currency"]): r["exchange_rate"] for r in records}
    for key, expected in SPOT_CHECKS.items():
        actual = by_key.get(key)
        if actual is None:
            failures.append(f"{key}: no matching record found")
        elif actual != expected:
            failures.append(f"{key}: expected {expected!r}, got {actual!r}")
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


def check_currency_count_per_date(records: list[dict]) -> list[str]:
    """Every date should carry the same set of 21 currencies — a gap here means a date's
    rows were dropped or the source published a partial day."""
    per_date = Counter(r["date"] for r in records)
    counts = set(per_date.values())
    if len(counts) != 1:
        histogram = Counter(per_date.values())
        return [f"inconsistent currencies-per-date, histogram: {dict(histogram)}"]
    return []


def main() -> None:
    raw = fetch_raw()
    records = parse_response(raw)

    checks = {
        "raw row count matches recordsTotal": check_recordstotal_matches(records, raw),
        "no duplicate (date, currency) keys": check_natural_key_uniqueness(records),
        "spot values match source": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record count is plausible": check_record_count(records),
        "every date has the same currency set": check_currency_count_per_date(records),
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
