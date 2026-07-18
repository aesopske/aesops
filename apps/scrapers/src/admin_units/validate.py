"""Runnable proof that scrape() output is correct — not just that it ran without error.

    uv run python -m src.admin_units.validate

This is the highest-risk dataset in the project (6-level hierarchy, 220 pages, 14k+ rows), so
every check here caught a real bug during development — see NOTES.md. Takes ~2 minutes since
it re-scrapes (and, for the cross-dataset check, scrapes county_subcounty_list too).
"""

import sys
from collections import defaultdict

from src.admin_units import scrape

SPOT_CHECKS = {
    (None, None, None, None, None): {
        "total": 47_564_296,
        "male": 23_548_056,
        "female": 24_014_716,
        "households_total": 12_143_913,
        "land_area_sq_km": 580_895.4,
        "population_density": 82,
    },
    ("MOMBASA", None, None, None, None): {
        "total": 1_208_333,
        "male": 610_257,
        "female": 598_046,
        "households_total": 378_422,
        "land_area_sq_km": 219.9,
        "population_density": 5_495,
    },
    ("MOMBASA", "CHANGAMWE", "CHANGAMWE", "CHAANI", "CHAANI"): {
        "total": 38_785,
        "male": 20_474,
        "female": 18_311,
        "households_total": 14_543,
        "households_group_quarters": 0,  # source PDF prints "-" (Nil) here
        "land_area_sq_km": 3.9,
        "population_density": 10_033,
    },
}

EXPECTED_COUNTY_COUNT = 47
# admin_units tracks Divisions, an enumeration concept with no equivalent in knbs_census or
# county_subcounty_list, so these bounds are plausibility ranges observed during development,
# not independently-sourced exact counts (unlike county count, which the other two datasets
# both corroborate at exactly 47).
RECORD_COUNT_RANGES = {
    "subcounty": (330, 400),
    "division": (800, 1_200),
    "location": (3_000, 4_500),
    "sublocation": (7_500, 10_000),
}

REQUIRED_FIELDS = ["total", "male", "female", "households_total", "land_area_sq_km", "population_density"]
# households_conventional/households_group_quarters/population_density can all legitimately
# hit the ".." (Negligible/suppressed) marker in the source table (confirmed by reading the
# raw PDF for a sample: "Arabuko Sokoke Forest" has population 10 over 405.1 sq km — a real
# density near zero that KNBS printed as ".." rather than "0", the same way small household
# counts get suppressed). Every other field should never be null.
NULLABLE_FIELDS = {"households_conventional", "households_group_quarters", "population_density"}

_PROTECTED_AREA_MARKERS = ("NATIONAL PARK", "NATIONAL RESERVE", "FOREST", "GAME RESERVE", "SANCTUARY")


def _looks_like_protected_area(name: str) -> bool:
    return any(marker in name.upper() for marker in _PROTECTED_AREA_MARKERS)


def _level_of(record: dict) -> str:
    if record["county"] is None:
        return "national"
    if record["subcounty"] is None:
        return "county"
    if record["division"] is None:
        return "subcounty"
    if record["location"] is None:
        return "division"
    if record["sublocation"] is None:
        return "location"
    return "sublocation"


def _key(record: dict) -> tuple:
    return (record["county"], record["subcounty"], record["division"], record["location"], record["sublocation"])


_LEVEL_DEPTH = {"national": 0, "county": 1, "subcounty": 2, "division": 3, "location": 4, "sublocation": 5}


def check_hierarchy_sums(records: list[dict]) -> list[str]:
    """The highest-leverage check: national == sum(counties) == sum(each county's
    sub-counties) == sum(each sub-county's divisions) == sum(each division's locations) ==
    sum(each location's sub-locations) — this is what actually caught the rpartition()
    number-parsing bug during development (every level failed identically until it was fixed).

    Walks `records` positionally (a stack of "open" parents, one per depth) rather than
    grouping children by their (county, subcounty, division, location) name tuple, because
    that key isn't actually unique: the source data itself has two distinct locations named
    "Bonyamatuta" under the same division ("Nyamira" division, Nyamira South sub-county,
    confirmed by reading the raw PDF) — a real KNBS naming collision, not a parsing bug. A
    name-keyed reconciliation would merge their children into one bucket and both fail; a
    positional walk (mirroring how assemble_records itself tracks ancestry) treats each
    occurrence as its own node regardless of name collisions, the same way a directory tree
    can have two files named the same thing in different folders.
    """
    failures: list[str] = []
    # stack[d] = [name-or-None, own_total, accumulated_children_total] for the currently-open
    # node at depth d (None for county/subcounty/division/location while d hasn't opened yet).
    stack: list[list] = [[None, 0, 0] for _ in range(6)]

    def close(depth: int) -> None:
        name, total, child_sum = stack[depth]
        if name is None or depth == 5:
            # Sub-location (depth 5) is the deepest level in this hierarchy — it never has
            # children of its own, so there's nothing to reconcile it against.
            stack[depth] = [None, 0, 0]
            return
        if child_sum == 0 and _looks_like_protected_area(name):
            # A handful of national parks/reserves terminate here with no further
            # subdivision at all (e.g. Tsavo West National Park has no location/sub-location
            # breakdown, unlike every populated area) — a real structural feature of the
            # source data, not a parsing failure.
            pass
        elif child_sum != total:
            failures.append(f"{name} (depth {depth}): children sum to {child_sum}, own total is {total}")
        stack[depth] = [None, 0, 0]

    field_by_depth = ["county", "subcounty", "division", "location", "sublocation"]
    for record in records:
        depth = _LEVEL_DEPTH[_level_of(record)]
        # Closing a node at depth d means checking it against what its own children summed
        # to, then folding its total into its parent's running child-sum. Any currently-open
        # deeper nodes (depth > d) must close first — they belong to the previous parent.
        for d in range(5, depth - 1, -1):
            close(d)
        name = "KENYA" if depth == 0 else record[field_by_depth[depth - 1]]
        stack[depth] = [name, record["total"], 0]
        if depth > 0:
            stack[depth - 1][2] += record["total"]

    for d in range(5, -1, -1):
        close(d)
    return failures


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key = {_key(r): r for r in records}
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
            if field in NULLABLE_FIELDS:
                continue
            if row[field] is None:
                failures.append(f"{_key(row)}.{field} is unexpectedly None")
    return failures


def check_record_counts(records: list[dict]) -> list[str]:
    failures = []
    by_level: dict[str, list] = defaultdict(list)
    for r in records:
        by_level[_level_of(r)].append(r)

    counties = {r["county"] for r in by_level["county"]}
    if len(counties) != EXPECTED_COUNTY_COUNT:
        failures.append(f"expected exactly {EXPECTED_COUNTY_COUNT} counties, got {len(counties)}")

    for level, (low, high) in RECORD_COUNT_RANGES.items():
        count = len(by_level[level])
        if not (low <= count <= high):
            failures.append(f"expected {low}-{high} {level} rows, got {count}")
    return failures


# admin_units' subcounty-level rows include forest reserves and national parks (their own
# row at the same indentation as a real sub-county) that aren't part of Table 1.2's official
# sub-county code list — investigated and enumerated exactly, see NOTES.md. Any name in this
# set is expected to be absent from county_subcounty_list; anything *outside* this set that
# doesn't match is a real regression, not known variance.
KNOWN_NON_CANONICAL_SUBCOUNTIES = {
    ("bomet", "mau forest"),
    ("bungoma", "mount elgon"),
    ("bungoma", "mt elgon forest"),
    ("embu", "mt kenya forest"),
    ("kericho", "mau forest"),
    ("kericho", "tinderet forest"),
    ("kirinyaga", "mt kenya forest"),
    ("meru", "meru national park"),
    ("meru", "mt kenya forest"),
    ("murang'a", "aberdare forest"),
    ("narok", "mau forest"),
    ("nyandarua", "aberdare national park"),
    ("nyeri", "aberdare forest"),
    ("nyeri", "mt kenya forest"),
    ("tharaka-nithi", "mt kenya forest"),
    ("vihiga", "kakamega forest"),
}


def _normalize(name: str) -> str:
    return " ".join(name.lower().replace(".", "").split())


def check_subcounty_count_matches_canonical_list(records: list[dict]) -> list[str]:
    """county_subcounty_list (Table 1.2) is the canonical subcounty enumeration — cross-check
    admin_units' subcounty-level rows against it name-by-name rather than trusting a count."""
    from src.county_subcounty_list import scrape as scrape_list

    failures = []
    canonical = {(_normalize(r["county_name"]), _normalize(r["subcounty_name"])) for r in scrape_list()}
    admin_subcounties = {
        (_normalize(r["county"]), _normalize(r["subcounty"])) for r in records if r["subcounty"] and r["division"] is None
    }

    unexpected_extra = admin_subcounties - canonical - KNOWN_NON_CANONICAL_SUBCOUNTIES
    if unexpected_extra:
        failures.append(f"admin_units has sub-counties not in the canonical list and not a known special area: {unexpected_extra}")

    missing = canonical - admin_subcounties
    if missing:
        failures.append(f"canonical sub-counties missing from admin_units: {missing}")

    stale_known_specials = KNOWN_NON_CANONICAL_SUBCOUNTIES - admin_subcounties
    if stale_known_specials:
        failures.append(
            f"KNOWN_NON_CANONICAL_SUBCOUNTIES lists entries no longer produced by the parser "
            f"(update the hardcoded set): {stale_known_specials}"
        )
    return failures


def main() -> None:
    records = scrape()
    checks = {
        "hierarchy sums reconcile at every level": check_hierarchy_sums(records),
        "spot values match source PDF": check_spot_values(records),
        "no unexplained nulls": check_null_audit(records),
        "record counts are plausible": check_record_counts(records),
        "subcounty count matches canonical list": check_subcounty_count_matches_canonical_list(records),
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
