# Extraction notes: KNBS 2019 census Volume II, Table 2.5 — Urban Centres

**Source**: same PDF as `county_subcounty_list`
(`2019-Kenya-population-and-Housing-Census-Volume-2-...pdf`, 270 pages). Table 2.5 lives on
pages 251–256, found dynamically by scanning for the `"Table 2.5"` label.

**Watch out**: that label also appears on the "List of Tables" ToC page and a chapter preface
page (pages 9 and 20) as plain reference text, not as an actual table. `find_table_pages`
picks those up too — deliberately not special-cased away, since `_parse_row` already rejects
any row that doesn't reduce to three parseable integers (`total`/`male`/`female`), which every
line on those two prose pages fails. Cheaper to let real row-shape validation do the
filtering than to hand-tune page-range exclusions.

## Structure

Flat — no admin hierarchy to track, unlike `knbs_census`/`admin_units`. Each row is
`(urban_centre, county, total, male, female)`, **sorted by population descending**, not
alphabetically, with the national "KENYA" aggregate as the first row. A handful of urban
centres straddle two counties and are printed as e.g. `"MURANG'A/KIAMBU"` — this is legitimate
source data, not a parsing artifact, so `county` is left as the raw slash-joined string rather
than picking one.

## What was tried and why it failed

Went straight to `page.extract_words()` + x-position column bucketing (the technique proven
in `knbs_census`) since this table's rendering looked structurally identical on inspection —
real whitespace between fields, numbers occasionally split across word tokens by fixed-width
right-alignment (e.g. Kenya's total renders as two words, `'1'` + `'4,744,474'`). No dot-leader
text here at all, so this parser is simpler than `knbs_census`'s: no leader-stripping, no
name/glued-digit-splitting regex — just bucket every word by x0 into one of 5 columns and join
(space for the two name columns, no separator for the three numeric ones).

## Edge cases

- **`total != male + female`** for 100 of 308 rows, always by a small positive amount (1 to
  680). Not a bug: the table's header carries a `Sex*` footnote — intersex counts are folded
  into `total` but not broken out as their own column at this geographic granularity
  (presumably a small-count suppression policy, same spirit as the `..` marker in the other
  tables). Confirmed by cross-checking: Mombasa's diff is exactly 30, matching Mombasa's
  known intersex count from `knbs_census` (Volume I, county-level). `validate.py` checks this
  discrepancy stays small and directionally consistent rather than asserting equality.
- **The national "KENYA" row is a real aggregate**: its `total` equals the sum of every other
  row's `total` exactly (14,744,474) — this is the single highest-value validation check for
  this dataset, the same sum-reconciliation principle as `knbs_census`, just with only two
  levels (national vs. everything else) instead of a multi-level hierarchy.
- **`county` is `None` for the "KENYA" row, not the string `"KENYA"`**: the source PDF prints
  `KENYA` in both the `urban_centre` and `county` columns for this row, but Kenya is the
  country, not a county — carrying that through literally would make the national total look
  like an ordinary urban centre whose county happens to be called "Kenya". Caught by a user
  reading the actual dataset output, not by any automated check (the null-audit and spot-check
  checks were updated afterward to cover it — `county is None` iff `urban_centre == "KENYA"`,
  enforced both ways). Matches how `knbs_census` and `admin_units` represent their own national
  rows (`county=None`), so downstream consumers can filter "is this a real county row?" the
  same way across all three datasets.
