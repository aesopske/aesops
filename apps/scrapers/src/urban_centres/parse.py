"""Parses Table 2.5 ("Distribution of Population by Urban Centres, Sex and County"): a flat
list — no admin hierarchy to track, unlike knbs_census or admin_units — of urban centre name,
county (occasionally more than one, e.g. "MURANG'A/KIAMBU" for a town straddling a border),
and total/male/female population. Sorted by population descending, not alphabetically.

Same underlying rendering as the other Volume II tables (numbers occasionally split across
word tokens by fixed-width right-alignment), but no dot-leader text here — real whitespace
separates every field — so this is simpler than knbs_census's parser: no leader-stripping,
no name/glued-digit splitting, just column bucketing by x0 with per-column join rules (space
for the two name columns, no separator for the three numeric columns that need reassembling).
"""

import pdfplumber

# (name, x0 threshold, join separator). Thresholds derived from header/data word positions
# (see NOTES.md); "total"/"male"/"female" use "" to reassemble numbers pdfplumber split
# across word tokens, the name columns use " " since they're genuinely multi-word.
COLUMNS = [
    ("urban_centre", 0, " "),
    ("county", 160, " "),
    ("total", 300, ""),
    ("male", 410, ""),
    ("female", 480, ""),
]

TABLE_LABEL = "Table 2.5"


def find_table_pages(pdf: pdfplumber.PDF) -> list[int]:
    return [i for i, page in enumerate(pdf.pages) if TABLE_LABEL in (page.extract_text() or "")]


def _bucket_for_x0(x0: float) -> str:
    bucket = COLUMNS[0][0]
    for name, threshold, _join in COLUMNS:
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


def _parse_row(row_words: list[dict]) -> dict | None:
    buckets: dict[str, list[tuple[float, str]]] = {name: [] for name, _t, _j in COLUMNS}
    for word in row_words:
        buckets[_bucket_for_x0(word["x0"])].append((word["x0"], word["text"]))

    joins = {name: join for name, _t, join in COLUMNS}
    values = {}
    for name, parts in buckets.items():
        ordered = [text for _x0, text in sorted(parts, key=lambda p: p[0])]
        values[name] = joins[name].join(ordered)

    # ToC/appendix pages that happen to contain the string "Table 2.5" (e.g. the "List of
    # Tables" page) produce rows with no numeric columns at all — skip rather than crash.
    if not (values["total"] and values["male"] and values["female"]):
        return None
    try:
        urban_centre = values["urban_centre"]
        return {
            "urban_centre": urban_centre,
            # The source prints "KENYA" in both columns for the national aggregate row — but
            # Kenya is the country, not a county, and treating it as one would make it look
            # like an ordinary (if oddly-named) urban centre's county instead of the total
            # across every county. None here matches how knbs_census and admin_units mark
            # their own national rows, rather than inventing a fake county value.
            "county": None if urban_centre == "KENYA" else values["county"],
            "total": int(values["total"].replace(",", "")),
            "male": int(values["male"].replace(",", "")),
            "female": int(values["female"].replace(",", "")),
        }
    except ValueError:
        return None


def parse_table(pdf: pdfplumber.PDF) -> list[dict]:
    records = []
    for page_index in find_table_pages(pdf):
        words = pdf.pages[page_index].extract_words(keep_blank_chars=False, use_text_flow=False)
        for row_words in _group_rows(words):
            record = _parse_row(row_words)
            if record is not None:
                records.append(record)
    return records
