from src.knbs_census.parse import ParsedRow
from src.utils.text import parse_float, parse_int

NATIONAL_KEY = ("Kenya", None)


def _keyed_rows(rows: list[ParsedRow]) -> dict[tuple[str, str | None], ParsedRow]:
    keyed: dict[tuple[str, str | None], ParsedRow] = {}
    current_county: str | None = None
    for row in rows:
        if row.level == "national":
            keyed[NATIONAL_KEY] = row
        elif row.level == "county":
            current_county = row.name
            keyed[(row.name, None)] = row
        else:
            keyed[(current_county, row.name)] = row
    return keyed


def merge_tables(
    table_2_5: list[ParsedRow],
    table_2_6: list[ParsedRow],
    table_2_7: list[ParsedRow],
) -> list[dict]:
    sex = _keyed_rows(table_2_5)
    households = _keyed_rows(table_2_6)
    land = _keyed_rows(table_2_7)

    records = []
    for key in sex:
        county, sub_county = key
        sex_row = sex[key]
        households_row = households.get(key)
        land_row = land.get(key)

        record = {
            "county": None if key == NATIONAL_KEY else county,
            "sub_county": sub_county,
            "male": parse_int(sex_row.columns.get("male")),
            "female": parse_int(sex_row.columns.get("female")),
            "intersex": parse_int(sex_row.columns.get("intersex")),
            "population": parse_int(sex_row.columns.get("total")),
            "number_of_households": parse_int(households_row.columns.get("number_of_households"))
            if households_row
            else None,
            "average_household_size": parse_float(households_row.columns.get("average_household_size"))
            if households_row
            else None,
            "land_area_sq_km": parse_float(land_row.columns.get("land_area_sq_km")) if land_row else None,
            "population_density": parse_int(land_row.columns.get("population_density")) if land_row else None,
        }
        records.append(record)
    return records
