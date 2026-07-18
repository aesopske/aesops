"""Runnable proof that scrape() output is correct — not just that it ran without error.

    uv run python -m src.county_subcounty_list.validate
"""

import sys
from collections import Counter

from src.county_subcounty_list import scrape

# Hand-verified against the source PDF directly (page 17's first rows, and known facts about
# Kenya's administrative structure).
SPOT_CHECKS = {
    (1, 101): {"county_name": "MOMBASA", "subcounty_name": "CHANGAMWE"},
    (12, 1201): {"county_name": "MERU", "subcounty_name": "BUURI EAST"},
}
EXPECTED_COUNTY_COUNT = 47
EXPECTED_SUBCOUNTY_COUNT = 334  # the canonical count of census sub-counties used in 2019
EXPECTED_MOMBASA_SUBCOUNTIES = {"CHANGAMWE", "JOMVU", "KISAUNI", "LIKONI", "MVITA", "NYALI"}

REQUIRED_FIELDS = ["county_code", "county_name", "subcounty_code", "subcounty_name"]


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key = {(r["county_code"], r["subcounty_code"]): r for r in records}
    for key, expected in SPOT_CHECKS.items():
        row = by_key.get(key)
        if row is None:
            failures.append(f"{key}: no matching record found")
            continue
        for field, expected_value in expected.items():
            if row[field] != expected_value:
                failures.append(f"{key}.{field}: expected {expected_value!r}, got {row[field]!r}")

    mombasa = {r["subcounty_name"] for r in records if r["county_name"] == "MOMBASA"}
    if mombasa != EXPECTED_MOMBASA_SUBCOUNTIES:
        failures.append(f"Mombasa sub-counties: expected {EXPECTED_MOMBASA_SUBCOUNTIES}, got {mombasa}")
    return failures


def check_null_audit(records: list[dict]) -> list[str]:
    failures = []
    for row in records:
        for field in REQUIRED_FIELDS:
            if not row[field] and row[field] != 0:
                failures.append(f"{row}: {field} is unexpectedly empty")
    return failures


def check_record_counts(records: list[dict]) -> list[str]:
    failures = []
    counties = {r["county_code"] for r in records}
    if len(counties) != EXPECTED_COUNTY_COUNT:
        failures.append(f"expected exactly {EXPECTED_COUNTY_COUNT} counties, got {len(counties)}")
    if counties != set(range(1, EXPECTED_COUNTY_COUNT + 1)):
        failures.append(f"county codes should be a contiguous 1-{EXPECTED_COUNTY_COUNT} range, got {sorted(counties)}")
    if len(records) != EXPECTED_SUBCOUNTY_COUNT:
        failures.append(f"expected exactly {EXPECTED_SUBCOUNTY_COUNT} sub-county rows, got {len(records)}")

    code_counts = Counter(r["subcounty_code"] for r in records)
    duplicates = {code: n for code, n in code_counts.items() if n > 1}
    if duplicates:
        failures.append(f"duplicate subcounty_code values (should be a unique key): {duplicates}")
    return failures


def check_cross_dataset_consistency(records: list[dict]) -> list[str]:
    """Table 1.2 is the canonical subcounty list — knbs_census (Volume I)'s county names
    should match it exactly (they're the same 47 counties). Sub-county name mismatches are
    expected to some degree since KNBS's own two volumes format a handful of names
    differently (e.g. "Lungalunga" vs "Lunga Lunga", "Samburu-Kwale" vs "Samburu") — reported
    as info, not a failure, unless the mismatch count spikes (which would suggest an actual
    extraction regression rather than known cosmetic variance)."""
    from src.knbs_census import scrape as scrape_census

    failures = []
    census_records = scrape_census()
    list_counties = {r["county_name"].lower() for r in records}
    census_counties = {r["county"].lower() for r in census_records if r["county"]}
    if list_counties != census_counties:
        failures.append(
            f"county name sets differ between datasets: "
            f"only in census={census_counties - list_counties}, only in list={list_counties - census_counties}"
        )

    list_subs = {(r["county_name"].lower(), r["subcounty_name"].lower()) for r in records}
    census_subs = {
        (r["county"].lower(), r["sub_county"].lower())
        for r in census_records
        if r["sub_county"] and "*" not in r["sub_county"]  # exclude Volume I's forest-reserve rows
    }
    mismatch_count = len(census_subs - list_subs) + len(list_subs - census_subs)
    print(f"  info: {mismatch_count} sub-county name(s) differ in formatting between volumes (expected, not a bug)")
    if mismatch_count > 15:
        failures.append(f"{mismatch_count} sub-county name mismatches between datasets — unexpectedly high, investigate")
    return failures


def main() -> None:
    records = scrape()
    checks = {
        "spot values match source PDF": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record counts are exact": check_record_counts(records),
        "consistent with knbs_census (Volume I)": check_cross_dataset_consistency(records),
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
