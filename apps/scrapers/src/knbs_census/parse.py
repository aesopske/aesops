"""Parses the KNBS 2019 census "Population by County and Sub-County" tables.

pdfplumber's table-detection (`page.extract_table()`) doesn't work on this PDF — there are
no ruling lines, just dot-leader tabular text — and even `extract_text(layout=True)` corrupts
numbers (mid-number spaces from fixed-width right-alignment). Instead we work word-by-word
via `page.extract_words()` and bucket each word into a column by its x-position, which survives
both problems: dot-leaders become their own discardable tokens, and split numbers are just
adjacent tokens in the same column bucket.
"""

from dataclasses import dataclass

import pdfplumber

from src.utils.text import clean_numeric_fragment, split_name_token

# x0 thresholds (points) marking where each column starts, derived from the PDF's fixed
# template layout (same across all pages of a given table). A word is assigned to the last
# column whose threshold is <= the word's x0.
TABLE_2_5_COLUMNS = [("male", 0), ("female", 283), ("intersex", 350), ("total", 416)]
TABLE_2_6_COLUMNS = [("population", 0), ("number_of_households", 300), ("average_household_size", 380)]
TABLE_2_7_COLUMNS = [("population", 0), ("land_area_sq_km", 300), ("population_density", 410)]

# Name x0 marks hierarchy depth in this PDF's fixed layout: national total ~83.7,
# county ~90.9-91.0, sub-county ~102.9-103.0.
_COUNTY_NAME_X0_MIN = 88
_SUBCOUNTY_NAME_X0_MIN = 97

_HEADER_NAME_PREFIXES = ("National", "County", "Table", "Cont")


@dataclass
class ParsedRow:
    level: str  # "national" | "county" | "subcounty"
    name: str
    columns: dict[str, str | None]


def find_table_pages(pdf: pdfplumber.PDF, table_label: str) -> list[int]:
    return [i for i, page in enumerate(pdf.pages) if table_label in (page.extract_text() or "")]


def _bucket_for_x0(x0: float, columns: list[tuple[str, float]]) -> str:
    bucket = columns[0][0]
    for name, threshold in columns:
        if x0 >= threshold:
            bucket = name
    return bucket


def _group_rows(words: list[dict]) -> list[list[dict]]:
    rows: list[list[dict]] = []
    for word in sorted(words, key=lambda w: (w["top"], w["x0"])):
        if rows and abs(rows[-1][-1]["top"] - word["top"]) < 2:
            rows[-1].append(word)
        else:
            rows.append([word])
    return rows


def _parse_row(row_words: list[dict], columns: list[tuple[str, float]]) -> ParsedRow | None:
    first = row_words[0]
    if not first["text"][0].isalpha() or first["text"].startswith(_HEADER_NAME_PREFIXES):
        return None

    name, glued_digit = split_name_token(first["text"])
    name_parts = [name]
    rest = row_words[1:]

    idx = 0
    while idx < len(rest) and rest[idx]["text"][0].isalpha():
        part_name, part_digit = split_name_token(rest[idx]["text"])
        name_parts.append(part_name)
        idx += 1
        if part_digit is not None:
            glued_digit = part_digit
            break
    rest = rest[idx:]

    fragments: dict[str, list[tuple[float, str]]] = {name: [] for name, _ in columns}
    if glued_digit is not None:
        fragments[columns[0][0]].append((first["x0"], glued_digit))

    for word in rest:
        cleaned = clean_numeric_fragment(word["text"])
        if cleaned is None:
            continue
        bucket = _bucket_for_x0(word["x0"], columns)
        fragments[bucket].append((word["x0"], cleaned))

    column_values: dict[str, str | None] = {}
    for col_name, parts in fragments.items():
        if not parts:
            column_values[col_name] = None
            continue
        ordered = [text for _x0, text in sorted(parts, key=lambda p: p[0])]
        column_values[col_name] = "".join(ordered)

    if not any(column_values.values()):
        # Header/label rows (e.g. "Male Female Intersex", "Total") carry no numeric data
        # in any column and start with a letter like real rows, so they survive the
        # startswith(_HEADER_NAME_PREFIXES) check above — filter them out here instead.
        return None

    x0 = first["x0"]
    level = "national" if x0 < _COUNTY_NAME_X0_MIN else "county" if x0 < _SUBCOUNTY_NAME_X0_MIN else "subcounty"
    return ParsedRow(level=level, name=" ".join(name_parts).strip(), columns=column_values)


def parse_table(pdf: pdfplumber.PDF, table_label: str, columns: list[tuple[str, float]]) -> list[ParsedRow]:
    rows: list[ParsedRow] = []
    for page_index in find_table_pages(pdf, table_label):
        words = pdf.pages[page_index].extract_words(keep_blank_chars=False, use_text_flow=False)
        for row_words in _group_rows(words):
            parsed = _parse_row(row_words, columns)
            if parsed is not None:
                rows.append(parsed)
    return rows


def parse_table_2_5(pdf: pdfplumber.PDF) -> list[ParsedRow]:
    return parse_table(pdf, "Table 2.5", TABLE_2_5_COLUMNS)


def parse_table_2_6(pdf: pdfplumber.PDF) -> list[ParsedRow]:
    return parse_table(pdf, "Table 2.6", TABLE_2_6_COLUMNS)


def parse_table_2_7(pdf: pdfplumber.PDF) -> list[ParsedRow]:
    return parse_table(pdf, "Table 2.7", TABLE_2_7_COLUMNS)
