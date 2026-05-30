import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 400, minLength = 0): T | '' {
    const [debounced, setDebounced] = useState<T | ''>(() =>
        typeof value === 'string' && value.length <= minLength ? '' : value,
    )

    useEffect(() => {
        const trimmed = typeof value === 'string' ? value.trim() : value
        const t = setTimeout(
            () => setDebounced(typeof trimmed === 'string' && trimmed.length <= minLength ? '' : trimmed as T),
            delay,
        )
        return () => clearTimeout(t)
    }, [value, delay, minLength])

    return debounced
}
