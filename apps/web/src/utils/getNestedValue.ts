type Indexable = Record<string, unknown> | unknown[]

function isIndexable(val: unknown): val is Indexable {
    return val !== null && typeof val === 'object'
}

/**
 * Traverses a nested object using dot-notation paths with optional array
 * bracket indexing, e.g. `"foo.bar[0].baz"`.
 *
 * Returns `null` if any segment along the path is missing or non-traversable.
 */
export function getNestedValue(obj: unknown, path: string): unknown {
    if (!obj || !path) return null

    return path.split('.').reduce<unknown>((acc, segment) => {
        if (!isIndexable(acc)) return null

        // Handle bracket notation: e.g. "items[2]"
        if (segment.includes('[')) {
            const bracketIndex = segment.indexOf('[')
            const key = segment.slice(0, bracketIndex)
            const indexMatch = segment.match(/\[(\d+)\]/)
            const index =
                indexMatch?.[1] !== undefined ? Number(indexMatch[1]) : null

            if (!key || index === null) return null

            const record = acc as Record<string, unknown>
            if (!(key in record)) return null

            const arr = record[key]
            if (!Array.isArray(arr)) return null

            return index < arr.length ? arr[index] : null
        }

        // Plain key access
        const record = acc as Record<string, unknown>
        return segment in record ? record[segment] : null
    }, obj)
}
