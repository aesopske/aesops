import { useMemo, useRef } from 'react'

function useOptimize(url = '') {
    const ref = useRef()

    const optimizedSrc = useMemo(() => {
        if (!url) return ''
        const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/fetch/f_auto,q_auto,c_fill,g_auto/`
        return `${cloudinaryUrl}${encodeURIComponent(url)}`
    }, [url])

    return { ref, optimizedSrc }
}

export default useOptimize
