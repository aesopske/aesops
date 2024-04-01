import { PATH } from '@sanity/lib/types'

export function getBreadcrumbs(path: string): PATH[] {
    const paths = path.split('/').filter((p) => p)
    return paths.map((p, i) => {
        const name = p.replace(/-/g, ' ')
        const href = `/${paths.slice(0, i + 1).join('/')}`
        return {
            name,
            href,
            active: i === paths.length - 1,
        }
    })
}
