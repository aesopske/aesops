# Extraction notes: KNBS 2019 census Volume II, Table 2.4 — Sub-Locations

**Source**: same PDF as `county_subcounty_list`/`urban_centres`
(`2019-Kenya-population-and-Housing-Census-Volume-2-...pdf`). By far the largest table in
either volume — pages 31–250 (220 pages), found dynamically via the `"Table 2.4"` label.

## Structure

A **6-level administrative hierarchy**: National → County → Sub-County → Division → Location
→ Sub-Location. Confirmed two independent ways before writing any hierarchy-tracking code:

1. The name column's x0 steps by an exact, constant 7.2pt per level (43.7 / 50.9 / 58.1 /
   65.3 / 72.5 / 79.7 on the sample page checked) — six distinct indentation depths, not five.
2. Sum reconciliation on that sample page: a "division" row (indent 4) can have the *same*
   name and value as its parent "sub-county" row (indent 3) when a sub-county happens to
   contain exactly one division — e.g. Changamwe sub-county (131,882) → Changamwe division
   (131,882, identical) → four locations (Chaani 38,785 / Changamwe 9,033 / Kwa Hola 18,568 /
   Port Reitz 65,496) that sum to exactly 131,882. Kenya still uses the pre-devolution
   Location/Sub-Location enumeration hierarchy underneath the political
   County/Sub-County/Ward structure — Division doesn't map to anything in `knbs_census` or
   `county_subcounty_list`, it's purely a Table 2.4 concept.

Columns: total, male, female (no separate intersex column — same `Sex*` footnoted suppression
as `urban_centres`), households total/conventional/group-quarters, land area, density.

## What was tried and why it failed (mostly didn't, but one real bug)

Given `urban_centres` already established that this volume's tables render as clean
whitespace-separated text (no dot-leaders), went straight to the x0-bucketing approach —
verified across **all 220 pages**, not just the sample, by scanning for the specific failure
signatures already seen elsewhere in this project: zero pages produced garbled long-token
words (the `county_subcounty_list` page-19 failure mode), and only two pages had unusually
long tokens, both legitimate multi-village sub-location names joined with `/`
(e.g. `"NORTH/JIRA/NOORGOS/BUKUMA"`).

**The real bug**: `_group_rows` sorted words by `(top, x0)` — the same helper used in
`urban_centres` and `knbs_census`, and it happened to work fine there. Here it silently broke:
two words on the same visual row can have slightly different exact `top` values (per-glyph
baseline jitter, e.g. `108.4` vs `108.558`), and sorting primarily by `top` reorders a row's
words by that jitter rather than by `x0` when top values differ even slightly — so
`row_words[0]` (used to find the name / determine hierarchy depth) was sometimes a *number*
token instead of the leftmost name token, silently rejecting every row on the page (`0` parsed
rows, no exception). Fixed by re-sorting each already-clustered row by `x0` before returning
it. This didn't show up in the other two parsers only because their name words happened to
have `top` values at or below their row's numeric columns — a coincidence, not a property to
rely on. **Any future word-bucketing parser in this project should re-sort by x0 within each
row explicitly**, not assume the top-sort left row order intact.

A second bug, in number parsing rather than extraction: `"47,564,296".rpartition(".")` — with
no `.` present — returns `('', '', '47564296')`, not `('', '', '')`. The original
`_parse_number` treated any truthy `frac` as "this has a decimal point," which misparsed every
comma-formatted integer as if the whole string were a fractional remainder (`47,564,296` →
`0.47564296`). Fixed by checking `"." in digits_and_dot` explicitly rather than relying on
`rpartition`'s return shape.

## Sub-county count doesn't match county_subcounty_list at first glance — explained

`admin_units` has 349 subcounty-level rows; `county_subcounty_list` (Table 1.2, the canonical
enumeration) has 334. Investigated rather than assumed-correct: diffing the two sets by
`(county, subcounty)` name found **15 rows in `admin_units` with no match** — all forest
reserves or national parks (`Mau Forest`, `Aberdare National Park`, `Mt. Kenya Forest`, etc.)
that Table 2.4 gives their own row at the sub-county indentation level, but which aren't part
of KNBS's official Table 1.2 sub-county code list. One exception proves the rule: Bungoma's
"Mt Elgon Forest" *is* in both tables — Table 1.2 spells it without the period after "Mt",
Table 2.4 with one, so a naive string comparison miscounted it as a 16th mismatch until
normalizing punctuation. `334 + 15 = 349`, exactly. `validate.py` checks this precisely
(canonical sub-counties match 1:1 after normalization, and the leftover set is exactly the 15
known special areas) rather than a fuzzy tolerance, so a real regression (an actual dropped or
duplicated sub-county) can't hide behind "eh, some mismatches are expected."

## Some rows terminate early — protected areas have no sub-location breakdown

A handful of national parks/reserves (Tsavo West, Tsavo East ×2, Lake Nakuru, Aberdare) appear
at the sub-county indentation level and repeat identically at division and location level
(same name, same total — the same "single matching child" pattern normal areas show, e.g.
Changamwe sub-county → Changamwe division), but then simply **stop**, with no sub-location
row at all beneath them, unlike every populated area. `check_hierarchy_sums` treats "zero
children" as a hard failure by default (it's usually a sign of a dropped row, as the two bugs
above prove), except when the parent's name matches a known protected-area pattern
(`NATIONAL PARK`, `FOREST`, `GAME RESERVE`, etc.) — see `_looks_like_protected_area`.

## A row split across two baselines — found by sum reconciliation, not inspection

One row in the entire 220-page table ("God Bondo Lower", a location in Nyatike sub-county,
Migori county) renders its name 4.92pt above its numbers — `top=703.76` for the name,
`top=708.68` for the numbers, versus ~0.1pt apart for every other row checked. Under
`_group_rows`'s normal `<2` clustering tolerance this silently produced two invalid rows (a
name with no numbers, numbers with no name) and both got discarded — no exception, no warning,
just one location's data quietly missing. Found by `validate.py`'s sum-reconciliation check:
Got Kachola division's location-children summed to exactly 8,569 less than its own total, and
8,569 was exactly God Bondo Lower's population.

**First fix attempt was wrong and worth recording why**: widening `_group_rows`' tolerance
from `<2` to `<6` did stitch this row back together, but also incorrectly merged an unrelated
row — a long wrapped location name ("Kanyarwanda Central") elsewhere on the same page whose
continuation line happened to land 5.04pt below, just inside the loosened tolerance. Row
spacing in this table isn't perfectly uniform, so a single global tolerance can't
distinguish "one row's internal jitter" from "the gap between two different rows." Reverted,
and instead added `_stitch_wrapped_rows`: a narrow, specific pattern match for "an all-name
row immediately followed by an all-numbers row, close together" — which only fires on the
exact failure shape (nothing to name, nothing to number) rather than loosening row detection
generally. The Kanyarwanda Central case doesn't match this pattern (its second line has both
a name fragment *and* numbers), so it's untouched.

## Two locations, same name, same division — a real data collision, not a parsing bug

`Nyamira` division (under `Nyamira South` sub-county, `Nyamira` county) contains **two
distinct locations both named "Bonyamatuta"** — one totalling 13,394 (with a single
sub-location child, Kebirigo, same value) and another totalling 4,295 (child: Nyabisimba).
Confirmed directly against the raw PDF text, not inferred. This broke the first version of
`check_hierarchy_sums`, which grouped children by their `(county, subcounty, division,
location)` name tuple — since both Bonyamatutas share that exact tuple, their children got
merged into one bucket (17,689) and neither individual total matched it. Rewrote the check to
walk `records` positionally instead (a depth-indexed stack of "open" parents, closed and
reconciled as each new record's depth pops the stack) — the same principle as
`assemble_records`' own ancestry tracking, just verifying it rather than building it. This
treats duplicate names the way a filesystem treats two identically-named files in different
directories: never confused, because identity comes from position in the tree, not from name.

## Two "no value" symbols, not one

Per this volume's front-matter Symbols and Conventions page: `"-"` means **Nil** (a true
zero — most sub-locations have no group-quarters households at all) and `".."` means
**Negligible** (a suppressed small count). These must map differently: `"-"` → `0`,
`".."` → `None`. Volume I (`knbs_census`) only used `".."`; this volume's tables use both,
and mixing them up would silently turn thousands of genuine zeros into missing data.
