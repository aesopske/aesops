from datetime import datetime

# Rows with this exact currency label are the table's own "Total"/blank filler rows on a
# handful of dates, not real currency observations — excluded rather than parsed as data.
_IGNORED_CURRENCIES = {""}


def _parse_date(raw: str) -> str:
    return datetime.strptime(raw, "%d/%m/%Y").date().isoformat()


def _parse_rate(raw: str) -> float:
    return float(raw.replace(",", ""))


def parse_response(payload: dict) -> list[dict]:
    # The source occasionally publishes an exact duplicate row for a date (observed on
    # 2025-11-28: all 21 currencies logged twice with identical values) — dedupe on the
    # natural key, but raise if a repeated key ever disagrees on value, since that would be
    # a real data conflict rather than a harmless duplicate.
    by_key: dict[tuple[str, str], dict] = {}
    for row in payload["data"]:
        raw_date, currency, raw_rate = row
        currency = currency.strip()
        if currency in _IGNORED_CURRENCIES:
            continue
        record = {
            "date": _parse_date(raw_date),
            "currency": currency,
            "exchange_rate": _parse_rate(raw_rate),
        }
        key = (record["date"], record["currency"])
        existing = by_key.get(key)
        if existing is not None and existing["exchange_rate"] != record["exchange_rate"]:
            raise ValueError(
                f"Conflicting rates for {key}: {existing['exchange_rate']} vs "
                f"{record['exchange_rate']}"
            )
        by_key[key] = record
    return list(by_key.values())
