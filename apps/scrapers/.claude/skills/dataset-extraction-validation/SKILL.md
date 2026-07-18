---
name: dataset-extraction-validation
description: Use whenever building, extending, or reviewing a scraper under apps/scrapers (PDF, HTML, spreadsheet, or otherwise). Produces two things every scraper module needs alongside its code — a NOTES.md documenting what extraction approaches were tried and why they failed, and a validate.py that proves the output is correct against the source rather than just "it ran without error." Always use this when adding a new scraper, when asked to document how a dataset was extracted, or when asked to validate/verify/sanity-check a scraper's output.
---

# Dataset extraction & validation

A scraper that runs without raising an exception has not been shown to be *correct*. PDF and
HTML table extraction fails silently far more often than it fails loudly: numbers split across
word-tokens, header rows that pass as data, filter heuristics that happen to match real values,
merge keys that drift apart between tables. The KNBS census scraper
(`src/knbs_census/`) hit all of these — see its `NOTES.md` and `validate.py` for the fully
worked example this skill generalizes from. Read those before building a new scraper; they show
the pattern in concrete detail, including a bug (a header filter whose `"Sub"` prefix also
matched the real place name "Subukia") that only sum-reconciliation caught, not manual
inspection.

Every scraper module (`src/<dataset>/`) should end up with two artifacts alongside its
`__init__.py`/`parse.py`:

## 1. `NOTES.md` — write this as you go, not after the fact

The value here is the *provenance of the approach*, not a description of the final code (the
code already documents itself). Capture, in this order:

1. **Source** — the exact URL, and what the document actually looks like (page count, which
   pages hold real data vs. front matter, any repeated/paginated table structure).
2. **What was tried and why it failed.** Be specific about the failure, not just "didn't
   work" — e.g. "`extract_table()` returns garbled multi-line cells because the PDF has no
   ruling lines, only dot-leader text" is useful; "table extraction didn't work" is not. This
   is the part that's easy to skip because by the time the scraper works you've forgotten the
   dead ends, but it's exactly what stops the next person (or the next you) from re-treading
   the same failed approach on a similar document.
3. **What worked, and why.** The technique, plus the specific evidence that it's right (e.g.
   "column boundaries derived from header word x-positions" rather than "used pdfplumber
   words").
4. **Edge cases that broke the first pass, and the fix.** Real ones — a suppressed-value
   marker, a name containing punctuation, a filter that was too broad. If you didn't hit any
   surprises, the validation step below probably wasn't thorough enough yet.

## 2. `validate.py` — a runnable check, not ad hoc exploration

It's tempting to eyeball a `print(records[:5])` and move on. Don't — that's how the merge-key
bug in NOTES.md shipped: the output looked plausible row-by-row and only broke down in
aggregate. Write an actual script (`uv run python -m src.<dataset>.validate`) that asserts
things and exits non-zero on failure, so it can be rerun after any change to the parser and
gate against regressions. Start from `assets/validate_template.py` in this skill and adapt the
four checks to the dataset's shape:

1. **Hierarchy/total reconciliation** — if the dataset has any kind of parent/child or
   subtotal structure (national → county → sub-county; category → subcategory; year →
   quarter → month), sum the children and assert it equals the parent's own reported value,
   at every level. This is the highest-leverage check: it catches corruption that looks fine
   locally but is wrong in aggregate (dropped rows, double-counted rows, merge-key mismatches
   across tables). If the dataset is genuinely flat with no such structure, replace this check
   with something else that independently corroborates correctness — e.g. a uniqueness
   constraint on the natural key, or cross-referencing one column against another
   independently-sourced total.
2. **Spot checks** — hardcode 3-5 values you've manually verified by reading the source
   document directly (not by trusting the parser's own output), covering different rows/levels
   (e.g. the overall total, a mid-sized entry, an edge case like the largest or smallest). This
   catches systemic-but-consistent corruption that a structural check like #1 might not, since
   a bug that shifts every number by the same wrong transformation can still sum correctly.
3. **Null/gap audit** — every `None`/missing value in a field that should normally be
   populated needs a *reason*, not a shrug. Distinguish "the source legitimately has no data
   here" (e.g. a suppression marker like `..`) from "the parser failed to extract this." Assert
   that fields with no legitimate reason to be null are never null, and explain in NOTES.md
   the fields that legitimately can be.
4. **Record-count sanity bounds** — assert the number of parsed records falls within a
   plausible range you can justify independently of the parser (e.g. "Kenya has exactly 47
   counties" is exact; "roughly 300-400 sub-county-level rows" is a bound, not a guess pulled
   from the parser's own output).

Keep the checks readable in the terminal: print `PASS`/`FAIL` per check with a short list of
concrete failures (not just a count) so a failure immediately tells you what broke and where,
the way `check_hierarchy_sums` in the KNBS example names the specific county that didn't
reconcile.

## Why bother proving it, not just running it

The point of both artifacts is that "the scraper ran and produced rows" is a much weaker claim
than "the scraper's output was checked against the source and here's how." When several
scrapers get built over time (per-dataset), NOTES.md is what lets a later change confidently
reuse or diverge from an earlier approach instead of re-discovering the same dead ends, and
validate.py is what lets you trust a refactor didn't quietly break something — the same way
the KNBS `validate.py` fails loudly and specifically (naming the exact two counties) if the
`"Sub"` prefix bug is reintroduced, rather than needing another round of manual REPL
exploration to notice.
