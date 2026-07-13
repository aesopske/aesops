// Shared constraints and naming helpers for uploaded dataset files, used by
// both the browser upload flow (tRPC `documents` router) and the programmatic
// scraper upload endpoint so the two stay in lock-step.

export const MAX_UPLOAD_BYTES = 32 * 1024 * 1024

export const ALLOWED_MIME = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const

export type AllowedMime = (typeof ALLOWED_MIME)[number]

export function isAllowedMime(value: string): value is AllowedMime {
    return (ALLOWED_MIME as readonly string[]).includes(value)
}

export function safeKeySegment(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'file'
}

// Strips a trailing file extension (e.g. ".csv", ".xlsx") from a name derived
// from an uploaded filename, so it doesn't leak into the stored name or slug.
export function stripExtension(name: string): string {
    return name.replace(/\.[^./]+$/, '')
}
