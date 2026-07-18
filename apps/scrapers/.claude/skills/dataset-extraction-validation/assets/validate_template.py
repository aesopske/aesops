"""Template for a scraper's validate.py — copy into src/<dataset>/validate.py and adapt.
See src/knbs_census/validate.py for a fully worked, dataset-specific example, and this
skill's SKILL.md for what each check is for.

Run standalone:  uv run python -m src.<dataset>.validate
Exits non-zero if any check fails, so it can gate CI or a manual re-run after parser changes.
"""

import sys
from collections import defaultdict

from src.TODO_DATASET import scrape  # noqa: E402  (rename the module)

# Hand-verify these against the source document directly — not by trusting the parser's own
# output — and cover a few different rows/levels (overall total, a mid-sized row, an edge case).
SPOT_CHECKS: dict[tuple, dict] = {
    # ("<key>",): {"field": expected_value, ...},
}
SPOT_CHECKS_KEY_FIELDS: list[str] = []  # TODO: the record fields that make up the tuple key above

# Adjust to what's actually true of the source (exact counts where you have them, plausible
# bounds where you don't).
EXPECTED_RECORD_COUNT_RANGE = (0, 10_000)  # TODO

# Fields that are allowed to be None with a known, source-backed reason (e.g. a suppression
# marker in the original document). Every other field failing null-check below is a bug.
NULLABLE_FIELDS: set[str] = set()  # TODO
REQUIRED_FIELDS: list[str] = []  # TODO


def check_hierarchy_sums(records: list[dict]) -> list[str]:
    """Delete/replace if the dataset has no parent/child or subtotal structure — but replace
    with *something* that independently corroborates correctness (e.g. natural-key
    uniqueness, or cross-referencing one column against an independent total), don't just
    drop this check with nothing in its place."""
    failures: list[str] = []
    # Example shape for a two-level hierarchy:
    # parents = [r for r in records if r["parent_id"] is None]
    # children = [r for r in records if r["parent_id"] is not None]
    # by_parent = defaultdict(list)
    # for row in children:
    #     by_parent[row["parent_id"]].append(row)
    # for parent in parents:
    #     child_sum = sum(r["value"] for r in by_parent[parent["id"]])
    #     if child_sum != parent["value"]:
    #         failures.append(f"{parent['id']}: children sum to {child_sum}, parent says {parent['value']}")
    return failures


def check_spot_values(records: list[dict]) -> list[str]:
    failures = []
    by_key = {tuple(r[k] for k in SPOT_CHECKS_KEY_FIELDS): r for r in records}  # TODO define key fields
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
                failures.append(f"{row}: {field} is unexpectedly None")
    return failures


def check_record_count(records: list[dict]) -> list[str]:
    low, high = EXPECTED_RECORD_COUNT_RANGE
    if not (low <= len(records) <= high):
        return [f"expected {low}-{high} records, got {len(records)}"]
    return []


def main() -> None:
    records = scrape()
    checks = {
        "hierarchy sums reconcile": check_hierarchy_sums(records),
        "spot values match source": check_spot_values(records),
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
