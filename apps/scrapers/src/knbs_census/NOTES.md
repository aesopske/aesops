# Extraction notes: KNBS 2019 census, Population by County and Sub-County

**Source**: `https://www.knbs.or.ke/wp-content/uploads/2023/09/2019-Kenya-population-and-Housing-Census-Volume-1-Population-By-County-And-Sub-County.pdf`
(49 pages, downloaded and inspected directly before writing any parser code).

## Structure

Pages 0–20 are cover/foreword/intro — no tabular data. Three data tables, each spanning
9 pages with a repeated/"Cont'd" header, detected dynamically by scanning each page's text
for its `Table 2.x` label rather than hardcoding page numbers (the PDF could be re-paginated
if KNBS re-publishes it):

- **Table 2.5**: Population by Sex and Sub-County → male, female, intersex, total
- **Table 2.6**: Population, Number of Households, Average Household Size
- **Table 2.7**: Population, Land Area (Sq. Km), Population Density

Rows have a 3-level hierarchy: national ("Kenya") → county → sub-county, plus a handful of
special footnoted "forest reserve" rows (e.g. "Mt Kenya Forest\*", "Aberdare Forest\*") that
sit at the sub-county indent level within a county but aren't real administrative sub-counties.

## What was tried and why it failed

1. **`page.extract_table()`** (pdfplumber's default table detector) — tried first since it's
   the obvious API. Failed: the PDF has no ruling lines, just dot-leader tabular text
   (`Mombasa…………………...… 610,257 598,046 30 1,208,333`), so pdfplumber's table-guessing
   produced garbled multi-line cells with no reliable column boundaries. Verified by running
   it and inspecting the actual output, not assumed from the PDF's visual appearance.
2. **`page.extract_text(layout=True)`** — preserves row structure via whitespace padding
   (indentation reliably marks hierarchy depth), but corrupts numbers: pdfplumber's
   char-gap tokenization inserts a stray space wherever the source PDF right-aligns a
   number in a fixed-width column, e.g. `610,257` renders as `6 10,257`. Regex reassembly
   of that (`\d \d{2,3},\d{3}` style patterns) is fragile and breaks on decimals, multi-word
   names, and footnote punctuation.

## What worked

**`page.extract_words()` with x-position column bucketing.** Each word token carries its own
`x0`/`x1`; column boundaries were derived once per table from where the header/data words
actually start (e.g. Table 2.5: male starts ~x0=230, female ~283, intersex ~350, total
~416 — see the thresholds in `parse.py`), then every numeric-region word on a row is bucketed
into the nearest column and concatenated in x-order. This survives both failure modes above:
split numbers are just two adjacent words in the same bucket, and dot-leader runs become their
own short discardable tokens (or get stripped via `clean_numeric_fragment`) rather than
corrupting a merged string.

Row hierarchy (national / county / sub-county) is read from the **x0 of the first word on
the row** — the PDF's fixed template indents each level by a consistent amount (national
~83.7pt, county ~90.9pt, sub-county ~102.9pt) — rather than from the text-layout indentation
character count, which is one more layer removed from the source geometry.

## Edge cases that broke the first pass (and the fix)

- **`.` `.` "" the missing-value marker.** Suppressed small counts (e.g. `intersex`) render
  as literal `..` in the source. Distinguished from dot-leader noise by exact length (`==".."`,
  not just "starts with dots") and mapped to `None`, never `0`.
- **A header-row filter that matched real names.** Rows like "National/ County" (the table's
  own header) were skipped by checking if the row's name started with a known prefix. `"Sub"`
  was on that list to catch the "County/ Sub County" header — but it also matched the real
  sub-county names **"Subukia"** and **"Suba North"/"Suba South"**, silently dropping them.
  Fixed by relying on `"County/"` (which already starts with `"County"`) instead of adding a
  separate `"Sub"` prefix, plus a second, more robust filter: any row where every numeric
  column came back empty is header/label noise regardless of what its name looks like.
- **A name regex that broke on punctuation.** The first version of the name-splitting regex
  only allowed `[A-Za-z'\-\s]`, so tokens like `"Forest*"` (footnote marker) and `"Mt."`
  (abbreviation) fell through to a fallback that returned the *uncleaned* text (leader dots and
  all). This didn't crash anything — but it meant `"Forest*..…...…….."` from table 2.5 and the
  cleaned `"Forest*"` from table 2.7 no longer matched as the same merge key, so the merged
  record silently lost its land-area columns. **This is why sum-reconciliation validation
  matters**: the parser "worked" (no exceptions, plausible-looking rows) and the bug was only
  caught by checking that county subtotals summed to the national total and that every merged
  field was non-null with a reason. Fixed by making the name regex permissive
  (`[^.…\d]+` — anything that isn't a leader char or digit) instead of an allow-list.

See `validate.py` for the checks that catch regressions of this kind.
