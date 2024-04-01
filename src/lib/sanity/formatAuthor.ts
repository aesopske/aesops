import { urlForImage } from '@sanity/lib/image'
import { AUTHOR } from '@sanity/lib/types'

export function formatAuthor(author: AUTHOR) {
    const formatName = (name: string) => {
        if (!name) return ''
        const nameArr = name.split(' ')
        if (nameArr.length === 1) return nameArr[0].charAt(0).toUpperCase()
        return nameArr
            .map((n) => n.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
    }

    const photoURL = author?.image ? urlForImage(author?.image) : ''

    return {
        ...author,
        initials: formatName(author?.name),
        photoURL: photoURL,
    }
}
