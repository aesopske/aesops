import re

MISSING_MARKER = ".."
_LEADER_PREFIX = re.compile(r"^[.…]+")
# Name = everything up to the first leader char (dot-leader runs are always '.'/'…'); this
# deliberately allows punctuation like the "*" footnote marker in "Forest*" or the "." in
# "Mt." rather than whitelisting name characters, since council/county naming conventions
# vary too much to enumerate.
_NAME_HEAD = re.compile(r"^([^.…\d]+)([.…]*)(\d*)$")


def split_name_token(text: str) -> tuple[str, str | None]:
    """Split a word like 'Mombasa…………………...…' or 'Kenya…………………………..…2' into
    (clean_name, glued_leading_digit_or_None). The digit only appears when the dot-leader
    run happens to butt directly against the first digit of the next column within the
    same pdfplumber word token (short names / wide numbers)."""
    match = _NAME_HEAD.match(text)
    if not match:
        return text, None
    name, _leaders, digits = match.groups()
    return name, (digits or None)


def clean_numeric_fragment(text: str) -> str | None:
    """Strip a leading dot-leader run from a numeric-region word token, and any ellipsis
    character wherever it appears (ellipsis glyphs never appear inside a real number, but
    occasionally bleed into the middle of a token due to font-kerning glitches). Returns
    None if the token is pure leader noise (nothing left after stripping) so callers can
    discard it."""
    if text == MISSING_MARKER:
        return MISSING_MARKER
    stripped = _LEADER_PREFIX.sub("", text).replace("…", "")
    return stripped if re.search(r"\d", stripped) else None


def parse_int(value: str | None) -> int | None:
    """Integer columns never legitimately contain a '.', so any stray leader-dot glued into
    the middle of a token (rare kerning artifact) is dropped along with thousands commas."""
    if value is None or value == MISSING_MARKER:
        return None
    return int(re.sub(r"[^\d]", "", value))


def parse_float(value: str | None) -> float | None:
    """Strip thousands commas, then treat only the last '.' as the real decimal point —
    any earlier ones are leftover leader-dot noise glued into the token."""
    if value is None or value == MISSING_MARKER:
        return None
    digits_and_dot = value.replace(",", "")
    whole, _sep, frac = digits_and_dot.rpartition(".")
    if not whole:
        return float(frac)
    return float(f"{whole.replace('.', '')}.{frac}")
