"""Run standalone:  uv run python -m src.cbk_weighted_average_rates.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_weighted_average_rates import fetch_raw
from src.cbk_weighted_average_rates.parse import parse_response

# Hand-verified directly against a raw curl of the AJAX endpoint (independent of parse.py),
# not by trusting the scraper's own output.
SPOT_CHECKS = {
    (1991, "September"): {"deposit": 13.49, "savings": 13.1, "lending": 17.26, "overdraft": 16.95},
    (2026, "May"): {"deposit": 6.8, "savings": 3.23, "lending": 14.5, "overdraft": 12.93},
}

# The source published a genuine conflicting duplicate for this (year, month) — two rows with
# different deposit/savings values and no way to tell which is authoritative. parse.py keeps
# both rather than guessing; see NOTES.md. Any *other* duplicate key would indicate a real
# regression (or a new instance of this same source quirk worth re-checking by hand).
KNOWN_CONFLICTING_KEY = (2026, "February")

VALID_MONTHS = {
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
}

# 419 rows observed live (Sep 1991 - May 2026, ~416 months + 1 known conflict pair) at time of
# writing; range gives headroom for future months without needing to be updated on every
# scheduled run.
EXPECTED_RECORD_COUNT_RANGE = (380, 800)
REQUIRED_FIELDS = ["year", "month", "deposit", "savings", "lending", "overdraft"]


def check_natural_key_uniqueness(records: list[dict]) -> list[str]:
    counts = Counter((r["year"], r["month"]) for r in records)
    unexpected_dupes = [
        k for k, n in counts.items() if n > 1 and k != KNOWN_CONFLICTING_KEY
    ]
    return [f"unexpected duplicate (year, month) key: {k}" for k in unexpected_dupes]


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key: dict[tuple, list[dict]] = {}
    for r in records:
        by_key.setdefault((r["year"], r["month"]), []).append(r)
    for key, expected in SPOT_CHECKS.items():
        candidates = by_key.get(key)
        if not candidates:
            failures.append(f"{key}: no matching record found")
            continue
        if not any(all(c[field] == value for field, value in expected.items()) for c in candidates):
            failures.append(f"{key}: expected {expected!r}, found {candidates!r}")
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


def main() -> None:
    raw = fetch_raw()
    records = parse_response(raw)

    checks = {
        "no unexpected duplicate (year, month) keys": check_natural_key_uniqueness(records),
        "spot values match source": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record count is plausible": check_record_count(records),
        "all month labels are valid": check_valid_months(records),
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
