export function getNestedValue(obj: unknown, path: string) {
    if (!obj || !path) return null
    return path.split('.').reduce((acc, curr) => {
        if (!acc) return acc // return null if acc is null

        // check if acc is an array and curr is a number
        if (curr.includes('[')) {
            const indexMatch = curr.match(/\d+/)
            const index = indexMatch ? indexMatch[0] : null
            const key = curr.split('[')[0]

            if (!acc[key]) return null // return null if key does not exist
            return acc[key][index]
        }
        return acc[curr]
    }, obj)
}
