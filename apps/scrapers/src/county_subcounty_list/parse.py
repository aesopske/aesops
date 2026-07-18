"""Parses Table 1.2 ("List of Counties and Sub-Counties"): a reference table of
(county_code, county_name, sub_county_code, sub_county_name), laid out as two side-by-side
blocks per physical row to pack more rows onto each page.

Unlike the population tables, this one has no dot-leader corruption to worry about — but
`page.extract_words()` completely breaks on one of its three pages (verified: the header and
first two pages extract cleanly, the third does not, even with tightened tolerances). Sorting
`page.chars` directly by (top, x0) reconstructs that page perfectly, so this parser bypasses
`extract_words()` entirely and buckets raw characters into columns instead — simpler than the
population-table parsers since there's no number-reassembly needed, just position-based
column assignment.
"""

import pdfplumber

# x0 thresholds derived from the header/data character positions (see NOTES.md). Two
# identical 4-column blocks side by side: (county_code, county_name, subcounty_code,
# subcounty_name) x2.
COLUMNS = [
    ("county_code", 0),
    ("county_name", 90),
    ("subcounty_code", 170),
    ("subcounty_name", 208),
    ("county_code_2", 310),
    ("county_name_2", 340),
    ("subcounty_code_2", 443),
    ("subcounty_name_2", 483),
]

TABLE_LABEL = "Table 1.2"
CONTINUATION_LABEL = "List of Counties and Sub-Counties"


def find_table_pages(pdf: pdfplumber.PDF) -> list[int]:
    pages = []
    for i, page in enumerate(pdf.pages):
        text = page.extract_text() or ""
        if TABLE_LABEL in text or CONTINUATION_LABEL in text:
            pages.append(i)
    return pages


def _bucket_for_x0(x0: float) -> str:
    bucket = COLUMNS[0][0]
    for name, threshold in COLUMNS:
        if x0 >= threshold:
            bucket = name
    return bucket


def _group_rows(chars: list[dict]) -> list[list[dict]]:
    rows: list[list[dict]] = []
    for char in sorted(chars, key=lambda c: (c["top"], c["x0"])):
        if rows and abs(rows[-1][-1]["top"] - char["top"]) < 2:
            rows[-1].append(char)
        else:
            rows.append([char])
    return rows


def _parse_row(row_chars: list[dict]) -> list[dict]:
    buckets: dict[str, list[str]] = {name: [] for name, _ in COLUMNS}
    for char in row_chars:
        buckets[_bucket_for_x0(char["x0"])].append(char["text"])
    values = {name: "".join(chars).strip() for name, chars in buckets.items()}

    records = []
    for suffix in ("", "_2"):
        county_code = values[f"county_code{suffix}"]
        if not county_code.isdigit():
            continue
        records.append(
            {
                "county_code": int(county_code),
                "county_name": values[f"county_name{suffix}"],
                "subcounty_code": int(values[f"subcounty_code{suffix}"]),
                "subcounty_name": values[f"subcounty_name{suffix}"],
            }
        )
    return records


def parse_table(pdf: pdfplumber.PDF) -> list[dict]:
    records = []
    for page_index in find_table_pages(pdf):
        # The header banner ("COUNTY COUNTY NAME SUB-COUNTY...") sits above top=105 on every
        # page; excluding it means _parse_row never has to special-case non-numeric codes.
        chars = [c for c in pdf.pages[page_index].chars if c["top"] > 105]
        for row_chars in _group_rows(chars):
            records.extend(_parse_row(row_chars))
    return records
