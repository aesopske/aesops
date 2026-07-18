import os
from contextlib import contextmanager
from pathlib import Path

import sentry_sdk
from dotenv import load_dotenv

# Mirrors src/utils/upload.py's env loading — values already in the environment
# (e.g. exported in CI) take precedence over the file.
load_dotenv(Path(__file__).parent.parent.parent / ".env.local")

_initialized = False


def init_sentry(scraper: str) -> None:
    """Initializes Sentry once per process. No-ops if SENTRY_DSN is unset so scrapers
    still run fine without Sentry configured (e.g. local dev without .env.local)."""
    global _initialized
    if _initialized:
        sentry_sdk.set_tag("scraper", scraper)
        return

    dsn = os.environ.get("SENTRY_DSN")
    if not dsn:
        return

    sentry_sdk.init(dsn=dsn, send_default_pii=True)
    sentry_sdk.set_tag("scraper", scraper)
    _initialized = True


@contextmanager
def track_errors(scraper: str):
    """Wraps a scraper's main logic: reports uncaught exceptions to Sentry, tagged with
    the scraper name, then re-raises so the process still exits non-zero and the
    GitHub Actions step still fails as before."""
    init_sentry(scraper)
    try:
        yield
    except Exception:
        sentry_sdk.capture_exception()
        raise
