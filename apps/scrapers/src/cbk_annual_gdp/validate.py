"""Run standalone:  uv run python -m src.cbk_annual_gdp.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import Counter

from src.cbk_annual_gdp import fetch_raw
from src.cbk_annual_gdp.parse import parse_response

# Hand-verified directly against a raw curl of the page (independent of parse.py), not by
# trusting the scraper's own output.
SPOT_CHECKS = {
    2000: {"nominal_gdp_prices": 967_838, "real_gdp_growth": 0.0, "real_gdp_prices": 982_855},
    2020: {"nominal_gdp_prices": 10_715_070, "real_gdp_growth": -0.3, "real_gdp_prices": 8_733_060},
    2025: {"nominal_gdp_prices": 17_577_557, "real_gdp_growth": 4.6, "real_gdp_prices": 11_406_590},
}

# 26 rows observed live (2000-2025) at time of writing; range gives headroom for a handful of
# years added/back-revised without needing to be updated on every yearly run.
EXPECTED_RECORD_COUNT_RANGE = (20, 60)
REQUIRED_FIELDS = ["year", "nominal_gdp_prices", "real_gdp_growth", "real_gdp_prices"]


def check_natural_key_uniqueness(records: list[dict]) -> list[str]:
    counts = Counter(r["year"] for r in records)
    dupes = [k for k, n in counts.items() if n > 1]
    return [f"duplicate year: {k}" for k in dupes]


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_year = {r["year"]: r for r in records}
    for year, expected in SPOT_CHECKS.items():
        actual = by_year.get(year)
        if actual is None:
            failures.append(f"{year}: no matching record found")
            continue
        for field, expected_value in expected.items():
            if actual[field] != expected_value:
                failures.append(f"{year}.{field}: expected {expected_value!r}, got {actual[field]!r}")
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


def check_year_range_contiguous(records: list[dict]) -> list[str]:
    """A gap here means a row was dropped during parsing (the source table has no gaps)."""
    years = sorted(r["year"] for r in records)
    expected = list(range(years[0], years[-1] + 1))
    if years != expected:
        missing = sorted(set(expected) - set(years))
        return [f"missing year(s) in range {years[0]}-{years[-1]}: {missing}"]
    return []


def main() -> None:
    raw = fetch_raw()
    records = parse_response(raw)

    checks = {
        "no duplicate years": check_natural_key_uniqueness(records),
        "spot values match source": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record count is plausible": check_record_count(records),
        "year range has no gaps": check_year_range_contiguous(records),
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
