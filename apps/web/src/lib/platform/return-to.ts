/**
 * Validate a `from`/return-to URL pulled from a query param.
 *
 * Only same-origin relative paths are allowed. Rejects protocol-relative
 * URLs (`//evil.com`), backslash variants (`/\evil.com`), and anything that
 * isn't an absolute path, to prevent open-redirect attacks.
 */
export function sanitizeReturnTo(from: string | null | undefined, fallback: string): string {
    if (!from) return fallback
    if (!from.startsWith('/')) return fallback
    if (from.startsWith('//') || from.startsWith('/\\')) return fallback
    return from
}
