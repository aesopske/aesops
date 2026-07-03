"""Remote DuckDB query executor.

apps/web builds and validates SQL itself (see dataset-query.ts's ident()/
buildFilter() — column names are checked against the dataset's known schema
and all values are escaped, so arbitrary tool input can't inject SQL). This
endpoint is a thin, trusted executor: it takes an already-safe SQL string,
runs it against a Parquet file read directly off a signed URL via httpfs, and
returns the rows as JSON.

It replaces an in-process @duckdb/duckdb-wasm instance in the Next.js app,
whose extension autoloader could not be made to work reliably inside Vercel's
Node Lambda sandbox (it ignored a locally pre-seeded extension cache and kept
trying — and failing — to fetch over the network). Native DuckDB's extension
autoinstall against a writable /tmp is a well-trodden, reliable path by
comparison.

Not publicly callable: every request must carry the shared secret in
EXECUTOR_SECRET, known only to the Next.js backend. Without it this would be
an open SSRF/DuckDB-as-a-service endpoint — anyone could pass an arbitrary
`sql` and have this fetch/read whatever URL that SQL references.
"""

import hmac
import json
import os
from http.server import BaseHTTPRequestHandler

import duckdb

SECRET = os.environ.get("EXECUTOR_SECRET", "")

_con = duckdb.connect(":memory:")
# $HOME isn't set in this sandbox, so DuckDB can't compute a default
# extension_directory — must be pointed at the one writable path (/tmp)
# before any INSTALL/autoload attempt.
_con.execute("SET home_directory='/tmp';")
_con.execute("INSTALL httpfs; LOAD httpfs; INSTALL parquet; LOAD parquet;")


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        provided = self.headers.get("x-executor-secret", "")
        if not SECRET or not hmac.compare_digest(provided, SECRET):
            self._json(401, {"error": "Unauthorized"})
            return

        length = int(self.headers.get("content-length", 0) or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            self._json(400, {"error": "Invalid JSON"})
            return

        sql = payload.get("sql")
        if not isinstance(sql, str) or not sql.strip():
            self._json(400, {"error": "Missing sql"})
            return

        try:
            result = _con.execute(sql)
            columns = [d[0] for d in result.description]
            rows = [dict(zip(columns, row)) for row in result.fetchall()]
            self._json(200, {"rows": rows})
        except Exception as err:  # noqa: BLE001 — reported to the caller, not swallowed
            self._json(500, {"error": str(err)})

    def _json(self, status: int, body: dict):
        data = json.dumps(body, default=str).encode()
        self.send_response(status)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(data)
