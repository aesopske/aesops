import os
from pathlib import Path

import requests
import truststore
from dotenv import load_dotenv

# Idempotent — safe to call again even though src/utils/download.py already does this for the
# PDF fetch; keeps this module usable standalone without relying on import order.
truststore.inject_into_ssl()

# Mirrors apps/web's own .env.local convention (git-ignored, developer-local secrets) rather
# than inventing a different config mechanism for this project's Python side. Values already
# present in the environment (e.g. exported in CI) take precedence over the file.
load_dotenv(Path(__file__).parent.parent.parent / ".env.local")

DEFAULT_API_URL = "http://localhost:3000"


class UploadNotConfigured(Exception):
    pass


def upload_dataset(
    csv_path: Path,
    *,
    name: str,
    description: str | None = None,
    license: str | None = None,
    source: str | None = None,
    dataset_slug: str | None = None,
) -> dict:
    """Uploads a scraper's CSV output to the aesops platform via the programmatic
    scraper-upload endpoint (apps/web/src/app/api/scraper/upload/route.ts).

    Authenticated with a Better Auth API key scoped to `datasets: ['write']` — create one
    from the platform's admin API key UI and set it as AESOPS_API_KEY. AESOPS_API_URL
    defaults to a local dev server; point it at a deployed instance to upload there instead.

    Passing `dataset_slug` uploads as a new revision of an existing dataset rather than
    creating a new one — matches the endpoint's own revision-chaining behavior (see the
    route's `parentId` resolution), so re-running a scraper against updated source data
    versions the same dataset instead of duplicating it.
    """
    api_key = os.environ.get("AESOPS_API_KEY")
    if not api_key:
        raise UploadNotConfigured("AESOPS_API_KEY is not set")
    api_url = os.environ.get("AESOPS_API_URL", DEFAULT_API_URL).rstrip("/")

    data = {"name": name}
    if description:
        data["description"] = description
    if license:
        data["license"] = license
    if source:
        data["source"] = source
    if dataset_slug:
        data["datasetSlug"] = dataset_slug

    with csv_path.open("rb") as f:
        response = requests.post(
            f"{api_url}/api/scraper/upload",
            headers={"Authorization": f"Bearer {api_key}"},
            files={"file": (csv_path.name, f, "text/csv")},
            data=data,
            timeout=120,
        )
    response.raise_for_status()
    return response.json()
