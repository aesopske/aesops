// function to title case a string while keeping a list of lowercase words to ignore
export function titleCase(str: string) {
    const ignore = [
        'and',
        'or',
        'the',
        'a',
        'an',
        'of',
        'in',
        'on',
        'at',
        'to',
        'for',
        'by',
        'with',
        'nor',
        'onto',
        'into',
    ]
    return str
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
            if (index === 0 || !ignore.includes(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1)
            }
            return word
        })
        .join(' ')
}
