FIELDNAMES = ["year", "month", "deposit", "savings", "lending", "overdraft"]


def _parse_float(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(payload: dict) -> list[dict]:
    # Unlike cbk_forex/cbk_inflation, (year, month) is not a reliable dedup key here: the
    # source has published a genuine conflicting duplicate for a real (year, month) — see
    # NOTES.md ("2026-02"), where two rows carry different deposit/savings values with no way
    # to tell which is authoritative. Deduping on the *full* record instead drops harmless
    # exact-duplicate rows (seen for a couple of other months) while preserving both sides of a
    # genuine conflict rather than silently discarding one.
    seen: dict[tuple, dict] = {}
    for row in payload["data"]:
        raw_year, month, raw_deposit, raw_savings, raw_lending, raw_overdraft = row
        record = {
            "year": int(raw_year),
            "month": month,
            "deposit": _parse_float(raw_deposit),
            "savings": _parse_float(raw_savings),
            "lending": _parse_float(raw_lending),
            "overdraft": _parse_float(raw_overdraft),
        }
        seen[tuple(record.items())] = record

    return list(seen.values())
