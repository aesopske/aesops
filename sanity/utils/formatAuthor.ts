import { urlForImage } from '@sanity/utils/image'
import { AUTHOR, AUTHOR_PLUS } from '@sanity/utils/types'

export function formatAuthor(author: AUTHOR): AUTHOR_PLUS {
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
