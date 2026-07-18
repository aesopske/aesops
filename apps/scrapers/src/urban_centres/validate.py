"""Runnable proof that scrape() output is correct — not just that it ran without error.

    uv run python -m src.urban_centres.validate
"""

import sys

from src.urban_centres import scrape

SPOT_CHECKS = {
    "KENYA": {"county": None, "total": 14_744_474, "male": 7_309_839, "female": 7_433_955},
    "NAIROBI CITY": {"county": "NAIROBI CITY", "total": 4_397_073, "male": 2_192_452, "female": 2_204_376},
    "MOMBASA": {"county": "MOMBASA", "total": 1_208_333, "male": 610_257, "female": 598_046},
    "THIKA": {"county": "MURANG'A/KIAMBU", "total": 251_407, "male": 123_308, "female": 128_081},
}
EXPECTED_RECORD_COUNT_RANGE = (250, 400)
# total = male + female + intersex, but intersex isn't its own column here — the gap should
# always be small and non-negative, never a wild number (which would signal a parsing bug
# rather than the known suppression behavior — see NOTES.md).
MAX_PLAUSIBLE_SEX_GAP_RATIO = 0.01

REQUIRED_FIELDS = ["urban_centre", "total", "male", "female"]


def check_national_total_reconciles(records: list[dict]) -> list[str]:
    kenya = next((r for r in records if r["urban_centre"] == "KENYA"), None)
    if kenya is None:
        return ["no 'KENYA' national aggregate row found"]
    others_sum = sum(r["total"] for r in records if r["urban_centre"] != "KENYA")
    if others_sum != kenya["total"]:
        return [f"sum(other rows.total)={others_sum} != KENYA.total={kenya['total']}"]
    return []


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_name = {r["urban_centre"]: r for r in records}
    for name, expected in SPOT_CHECKS.items():
        row = by_name.get(name)
        if row is None:
            failures.append(f"{name}: no matching record found")
            continue
        for field, expected_value in expected.items():
            if row[field] != expected_value:
                failures.append(f"{name}.{field}: expected {expected_value!r}, got {row[field]!r}")
    return failures


def check_sex_gap_is_plausible(records: list[dict]) -> list[str]:
    failures = []
    for row in records:
        gap = row["total"] - (row["male"] + row["female"])
        if gap < 0 or gap > row["total"] * MAX_PLAUSIBLE_SEX_GAP_RATIO:
            failures.append(f"{row['urban_centre']}: total-(male+female)={gap}, implausible for a row of size {row['total']}")
    return failures


def check_null_audit(records: list[dict]) -> list[str]:
    failures = []
    for row in records:
        for field in REQUIRED_FIELDS:
            if not row[field] and row[field] != 0:
                failures.append(f"{row['urban_centre']}: {field} is unexpectedly empty")
        is_national = row["urban_centre"] == "KENYA"
        if is_national and row["county"] is not None:
            failures.append(f"KENYA row: county should be None (it's the national total, not a county), got {row['county']!r}")
        if not is_national and row["county"] is None:
            failures.append(f"{row['urban_centre']}: county is unexpectedly None")
    return failures


def check_record_count(records: list[dict]) -> list[str]:
    low, high = EXPECTED_RECORD_COUNT_RANGE
    if not (low <= len(records) <= high):
        return [f"expected {low}-{high} urban centres, got {len(records)}"]
    return []


def main() -> None:
    records = scrape()
    checks = {
        "national total reconciles": check_national_total_reconciles(records),
        "spot values match source PDF": check_spot_values(records),
        "male+female vs total gap is plausible (intersex suppression)": check_sex_gap_is_plausible(records),
        "no unexplained nulls": check_null_audit(records),
        "record count is plausible": check_record_count(records),
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
