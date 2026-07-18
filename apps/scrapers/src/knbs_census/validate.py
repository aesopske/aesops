"""Runnable proof that scrape() output is correct — not just that it ran without error.

    uv run python -m src.knbs_census.validate

Exits non-zero if any check fails. See NOTES.md for why each of these checks exists (in
short: every one of them caught a real bug during development that "the script ran fine"
did not).
"""

import sys
from collections import defaultdict

from src.knbs_census import scrape

# Hand-verified against the source PDF directly (page 21/30/39 "Mombasa" row, and the
# "Kenya" national total row). If these ever stop matching, the parser broke, not the data.
SPOT_CHECKS = {
    (None, None): {
        "male": 23_548_056,
        "female": 24_014_716,
        "intersex": 1_524,
        "population": 47_564_296,
        "number_of_households": 12_143_913,
        "average_household_size": 3.9,
        "land_area_sq_km": 580_876.3,
        "population_density": 82,
    },
    ("Mombasa", None): {
        "male": 610_257,
        "female": 598_046,
        "intersex": 30,
        "population": 1_208_333,
        "number_of_households": 378_422,
        "average_household_size": 3.1,
        "land_area_sq_km": 219.9,
        "population_density": 5_495,
    },
    ("Nairobi City", None): {
        "male": 2_192_452,
        "female": 2_204_376,
        "intersex": 245,
        "population": 4_397_073,
        "number_of_households": 1_506_888,
        "average_household_size": 2.9,
        "land_area_sq_km": 703.9,
        "population_density": 6_247,
    },
}

EXPECTED_COUNTY_COUNT = 47
# Kenya has 47 counties and roughly 300-360 sub-counties/wards plus a handful of footnoted
# special areas (forest reserves) in this table; this is a plausibility bound, not an exact
# count, since KNBS doesn't publish a canonical sub-county total independent of this table.
SUBCOUNTY_COUNT_RANGE = (300, 400)

# intersex is legitimately null (source PDF prints ".." for suppressed small counts) — every
# other field should always be populated once a record has been through all three tables.
NULLABLE_FIELDS = {"intersex"}
REQUIRED_FIELDS = [
    "male",
    "female",
    "population",
    "number_of_households",
    "average_household_size",
    "land_area_sq_km",
    "population_density",
]


def check_hierarchy_sums(records: list[dict]) -> list[str]:
    """National total must equal the sum of counties, which must equal the sum of
    sub-county/leaf rows. This is what actually caught the merge-key bug described in
    NOTES.md — the parser produced plausible-looking rows with no exceptions, but a
    handful of merged fields were silently None because a name didn't match across tables."""
    failures = []
    national = next(r for r in records if r["county"] is None)
    counties = [r for r in records if r["county"] and r["sub_county"] is None]
    leaves = [r for r in records if r["sub_county"] is not None]

    county_sum = sum(r["population"] for r in counties)
    if county_sum != national["population"]:
        failures.append(f"sum(counties.population)={county_sum} != national.population={national['population']}")

    by_county = defaultdict(list)
    for row in leaves:
        by_county[row["county"]].append(row)
    county_population = {r["county"]: r["population"] for r in counties}
    for county, rows in by_county.items():
        leaf_sum = sum(r["population"] for r in rows)
        expected = county_population[county]
        if leaf_sum != expected:
            failures.append(f"{county}: sum(sub_county.population)={leaf_sum} != county.population={expected}")

    return failures


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key = {(r["county"], r["sub_county"]): r for r in records}
    for key, expected in SPOT_CHECKS.items():
        row = by_key.get(key)
        if row is None:
            failures.append(f"{key}: no matching record found")
            continue
        for field, expected_value in expected.items():
            if row[field] != expected_value:
                failures.append(f"{key}.{field}: expected {expected_value!r}, got {row[field]!r}")
    return failures


def check_null_audit(records: list[dict]) -> list[str]:
    failures = []
    for row in records:
        for field in REQUIRED_FIELDS:
            if row[field] is None:
                failures.append(f"{(row['county'], row['sub_county'])}.{field} is unexpectedly None")
    return failures


def check_record_counts(records: list[dict]) -> list[str]:
    failures = []
    counties = [r for r in records if r["county"] and r["sub_county"] is None]
    leaves = [r for r in records if r["sub_county"] is not None]
    if len(counties) != EXPECTED_COUNTY_COUNT:
        failures.append(f"expected exactly {EXPECTED_COUNTY_COUNT} counties, got {len(counties)}")
    low, high = SUBCOUNTY_COUNT_RANGE
    if not (low <= len(leaves) <= high):
        failures.append(f"expected {low}-{high} sub-county/leaf rows, got {len(leaves)}")
    return failures


def main() -> None:
    records = scrape()
    checks = {
        "hierarchy sums reconcile": check_hierarchy_sums(records),
        "spot values match source PDF": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record counts are plausible": check_record_counts(records),
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
