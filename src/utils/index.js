export const optimizeImage = (url) => {
    if (!url) return ''

    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/fetch/f_auto,q_auto,c_fill,g_auto/`
    return `${cloudinaryUrl}${encodeURIComponent(url)}`
}
