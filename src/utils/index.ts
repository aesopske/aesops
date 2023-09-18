export const optimizeImage = (url = '', encode = true) => {
    if (!url) return ''

    const encodedUrl = encodeURIComponent(url)

    const cloudinaryUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/fetch/f_auto,q_auto,c_fill,g_auto/`
    return `${cloudinaryUrl}${encode ? encodedUrl : url}`
}
