# Extraction notes: KNBS 2019 census Volume II, Table 1.2 — List of Counties and Sub-Counties

**Source**: `https://www.knbs.or.ke/wp-content/uploads/2023/09/2019-Kenya-population-and-Housing-Census-Volume-2-Distribution-of-Population-by-Administrative-Units.pdf`
(270 pages total; this table lives on pages 17–19, found by scanning each page's text for
`"Table 1.2"` on the first page and the `"List of Counties and Sub-Counties Cont'"` label on
continuation pages, rather than hardcoding page numbers.)

## Structure

A reference table of `(county_code, county_name, subcounty_code, subcounty_name)` — the
canonical mapping KNBS used to enumerate the census. Laid out as **two identical 4-column
blocks side by side** per physical page row (left block and right block), to fit more rows
per page. No hierarchy, no dot-leader text — much simpler shape than `knbs_census`.

## What was tried and why it failed

**`page.extract_words()`** worked fine on the first two pages (17, 18) but produced complete
garbage on the third (19) — output like `'UO3333333333333333333333344444444444444444444'`
and repeated fragments like `'A K A M E'` down dozens of lines, nothing resembling the real
`(code, name)` pairs. This wasn't a tolerance-tuning issue (tried `x_tolerance=1,
y_tolerance=1`, same garbage) — it's specifically `extract_words()`'s internal
word-clustering that breaks on this page, not a bad word-boundary read.

Confirmed the *raw* character data on that page is actually fine: pulling `page.chars`
directly and sorting by `(round(top, 1), x0)` reconstructs perfectly clean rows (e.g.
`"37 KAKAMEGA 3707 LIKUYANI 43 HOMA BAY 4301 HOMA BAY"`). So the PDF's content stream isn't
corrupted — `extract_words()`'s clustering heuristic just fails on whatever is different
about this page (page 19 is >95% non-`upright` characters per `page.chars` — a horizontally
condensed font scale (matrix `[0.93, 0, ...]`), used to cram this page's data in tighter than
pages 17/18; that's the most likely trigger, though the exact clustering bug inside
pdfplumber wasn't tracked down further since the workaround was cheap).

## What worked

Bypass `extract_words()` entirely: group `page.chars` into rows by rounded `top`, then bucket
each **character** (not word) directly into one of 8 fixed x0 column ranges and concatenate
in x-order within each bucket. This is simpler than the population-table parsers (no
number-reassembly needed — codes are short and names don't get glued to leader-dots here) and
sidesteps whatever's wrong with `extract_words()` on page 19 completely, since it never runs.

## Validation

This table is the *canonical* subcounty list, so `knbs_census` (Volume I)'s sub-county names
should be a near-subset of this table's (Volume I's list also includes a handful of footnoted
forest-reserve rows that aren't real administrative sub-counties and won't appear here — see
`validate.py`, which cross-checks the two datasets against each other rather than just
checking this one in isolation).
