// function to generate random string
export function getRandomString(prefix: string, length: number) {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*£€!'
    const prefixLength = prefix.length

    let randomString = ''

    for (let i = 0; i < length - prefixLength; i++) {
        const randomChar = characters.charAt(
            Math.floor(Math.random() * characters.length)
        )
        randomString += randomChar
    }

    return prefix + randomString
}
