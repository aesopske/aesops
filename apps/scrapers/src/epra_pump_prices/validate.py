"""Run standalone:  uv run python -m src.epra_pump_prices.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.epra_pump_prices import fetch_raw
from src.epra_pump_prices.parse import parse_response

# Hand-verified directly against a raw curl of the page (independent of parse.py), not by
# trusting the scraper's own output.
SPOT_CHECKS = {
    ("2025-12-15", "2026-01-14", "Lamu"): {
        "super_pms": 186.58, "diesel_ago": 173.54, "kerosene_ik": 156.84,
    },
    ("2026-01-15", "2026-02-14", "Kimilili"): {
        "super_pms": 183.67, "diesel_ago": 171.97, "kerosene_ik": 155.32,
    },
}

# 21 price-review periods observed live (Nov 2024 - Jul 2026), 223 towns per period, at time of
# writing -> ~4,683 rows. Range gives headroom for future periods/towns without needing to be
# updated on every scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (4_000, 10_000)
EXPECTED_TOWNS_PER_PERIOD = 223
REQUIRED_FIELDS = ["period_from", "period_to", "town", "super_pms", "diesel_ago", "kerosene_ik"]


def check_natural_key_uniqueness(records: list[dict]) -> list[str]:
    counts = Counter((r["period_from"], r["period_to"], r["town"]) for r in records)
    dupes = [k for k, n in counts.items() if n > 1]
    return [f"duplicate (period_from, period_to, town) key: {k}" for k in dupes]


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key = {(r["period_from"], r["period_to"], r["town"]): r for r in records}
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


def check_towns_per_period_consistent(records: list[dict]) -> list[str]:
    """Every price review period should cover the same set of towns — a gap here means a
    period's rows were dropped or the source published a partial period."""
    per_period = Counter((r["period_from"], r["period_to"]) for r in records)
    off_counts = {k: n for k, n in per_period.items() if n != EXPECTED_TOWNS_PER_PERIOD}
    return [
        f"period {k}: {n} towns, expected {EXPECTED_TOWNS_PER_PERIOD}"
        for k, n in sorted(off_counts.items())
    ]


def check_non_negative(records: list[dict]) -> list[str]:
    failures = []
    for r in records:
        for field in ("super_pms", "diesel_ago", "kerosene_ik"):
            if r[field] < 0:
                failures.append(
                    f"{r['period_from']}-{r['town']}: {field} is negative ({r[field]})"
                )
    return failures


def main() -> None:
    raw = fetch_raw()
    records = parse_response(raw)

    checks = {
        "no duplicate (period_from, period_to, town) keys": check_natural_key_uniqueness(records),
        "spot values match source": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record count is plausible": check_record_count(records),
        "every period has the same town count": check_towns_per_period_consistent(records),
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
