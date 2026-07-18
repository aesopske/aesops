"""Parses Table 2.4 ("Distribution of Population by Sex, Number of Households, Land Area,
Population Density and Sub Locations") — by far the largest table in Volume II (220 pages)
and the finest-grained one: a 6-level administrative hierarchy, National > County >
Sub-County > Division > Location > Sub-Location, confirmed by exact, evenly-spaced x0
indentation of the name column (7.2pt per level — 43.7/50.9/58.1/65.3/72.5/79.7 on the
sample page checked) and by sum reconciliation at every level transition (see validate.py).

Structurally this table renders cleanly — real whitespace, no dot-leader text (unlike
knbs_census's Volume I tables) — confirmed across all 220 pages, not assumed: scanned for
long/garbled word tokens (the failure mode that broke county_subcounty_list on one page) and
found none, so this reuses the plain x0-bucketing technique from urban_centres rather than
knbs_census's leader-stripping logic. The one genuine wrinkle is two distinct "no value"
symbols used inconsistently across the population tables in this volume's front matter: "-"
means Nil (a true zero, e.g. a sub-location with no group-quarters households) and ".."
means Negligible (a suppressed small count) — these must not both collapse to the same thing.
"""

import re

import pdfplumber

_NUMERIC = re.compile(r"^[\d,]+(\.\d+)?$")

# (name, x0 threshold). Thresholds derived from header/data word positions across a sample
# page and hold across the table's 220 pages (fixed template, like the other Volume II
# tables) — see NOTES.md for the exact reference values.
COLUMNS = [
    ("name", 0),
    ("total", 150),
    ("male", 232),
    ("female", 275),
    ("households_total", 317),
    ("households_conventional", 365),
    ("households_group_quarters", 420),
    ("land_area_sq_km", 463),
    ("population_density", 505),
]

# Name x0 steps by exactly 7.2pt per hierarchy level (43.7 national / 50.9 county / 58.1
# sub-county / 65.3 division / 72.5 location / 79.7 sub-location); thresholds are the
# midpoints between consecutive levels.
LEVELS = [
    ("national", 0),
    ("county", 47.3),
    ("subcounty", 54.5),
    ("division", 61.7),
    ("location", 68.9),
    ("sublocation", 76.1),
]

NIL = "-"  # a true zero (e.g. no group-quarters households in this sub-location)
NEGLIGIBLE = ".."  # a suppressed/negligible small count

TABLE_LABEL = "Table 2.4"


def find_table_pages(pdf: pdfplumber.PDF) -> list[int]:
    return [i for i, page in enumerate(pdf.pages) if TABLE_LABEL in (page.extract_text() or "")]


def _bucket_for_x0(x0: float, thresholds: list[tuple[str, float]]) -> str:
    bucket = thresholds[0][0]
    for name, threshold in thresholds:
        if x0 >= threshold:
            bucket = name
    return bucket


def _group_rows(words: list[dict]) -> list[list[dict]]:
    # Cluster by top first (primary sort key), then re-sort each finished row by x0: two
    # words in the same visual row can have slightly different exact `top` values (per-glyph
    # baseline jitter), so sorting by (top, x0) directly can leave a row's words out of
    # left-to-right order — which matters here because _parse_row relies on row_words[0]
    # being the leftmost (name) word.
    rows: list[list[dict]] = []
    for word in sorted(words, key=lambda w: (w["top"], w["x0"])):
        if rows and abs(rows[-1][-1]["top"] - word["top"]) < 2:
            rows[-1].append(word)
        else:
            rows.append([word])
    for row in rows:
        row.sort(key=lambda w: w["x0"])
    return rows


def _parse_row(row_words: list[dict]) -> dict | None:
    first = row_words[0]
    if not first["text"][0].isalpha():
        return None

    buckets: dict[str, list[tuple[float, str]]] = {name: [] for name, _t in COLUMNS}
    for word in row_words:
        bucket = _bucket_for_x0(word["x0"], COLUMNS)
        buckets[bucket].append((word["x0"], word["text"]))

    name_parts = [text for _x0, text in sorted(buckets["name"], key=lambda p: p[0])]
    name = " ".join(name_parts)

    values: dict[str, str | None] = {}
    for col_name, _threshold in COLUMNS[1:]:
        parts = sorted(buckets[col_name], key=lambda p: p[0])
        if not parts:
            values[col_name] = None
        elif len(parts) == 1 and parts[0][1] in (NIL, NEGLIGIBLE):
            values[col_name] = parts[0][1]
        else:
            values[col_name] = "".join(text for _x0, text in parts)

    total = values["total"]
    if total is None or (total not in (NIL, NEGLIGIBLE) and not _NUMERIC.match(total)):
        # Header/label rows ("Table 2.4: Distribution...", "Sex* Total Male Female...") have
        # a name-shaped first word and non-None values (header text lands in some bucket),
        # but "total" specifically never looks like a real number for these — real data rows
        # always have a parseable total.
        return None

    level = _bucket_for_x0(first["x0"], LEVELS)
    return {"level": level, "name": name, "raw": values}


_NAME_END_THRESHOLD = COLUMNS[1][1]  # x0 where the "total" column starts


def _stitch_wrapped_rows(rows: list[list[dict]]) -> list[list[dict]]:
    """One row in the whole 220-page table ("God Bondo Lower", Nyatike sub-county) renders
    its name 4.92pt above its numbers — enough to land in separate row-groups under the tight
    tolerance _group_rows needs elsewhere, silently discarding both halves as invalid (a
    name with no numbers, and numbers with no name), which sum-reconciliation validation
    caught (the location's total went missing from its parent's sum by exactly that amount).
    Rather than loosening _group_rows' tolerance generally — tried first, but it over-merged
    an unrelated wrapped multi-line name elsewhere on the same page, since row spacing isn't
    perfectly uniform — detect this specific pattern (an all-name row immediately followed by
    an all-numbers row, close enough together to plausibly be one split row) and stitch just
    those two back together."""
    stitched: list[list[dict]] = []
    i = 0
    while i < len(rows):
        row = rows[i]
        is_name_only = all(w["x0"] < _NAME_END_THRESHOLD for w in row)
        if is_name_only and i + 1 < len(rows):
            next_row = rows[i + 1]
            is_numbers_only = all(w["x0"] >= _NAME_END_THRESHOLD for w in next_row)
            gap = abs(next_row[0]["top"] - row[0]["top"])
            if is_numbers_only and gap < 8:
                stitched.append(sorted(row + next_row, key=lambda w: w["x0"]))
                i += 2
                continue
        stitched.append(row)
        i += 1
    return stitched


def parse_table(pdf: pdfplumber.PDF) -> list[dict]:
    rows = []
    for page_index in find_table_pages(pdf):
        words = pdf.pages[page_index].extract_words(keep_blank_chars=False, use_text_flow=False)
        for row_words in _stitch_wrapped_rows(_group_rows(words)):
            parsed = _parse_row(row_words)
            if parsed is not None:
                rows.append(parsed)
    return rows
