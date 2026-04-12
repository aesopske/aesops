export function getRandomString(prefix: string, length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*£€!"
  const prefixLength = prefix.length

  let randomString = ""

  for (let i = 0; i < length - prefixLength; i++) {
    const randomChar = characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
    randomString += randomChar
  }

  return prefix + randomString
}

export function getNestedValue(obj: any, path: string) {
  if (!obj || !path) return null
  return path.split(".").reduce((acc, curr) => {
    if (!acc) return acc

    if (curr.includes("[")) {
      const indexMatch = curr.match(/\d+/)
      const index = indexMatch ? indexMatch[0] : null
      const key = curr.split("[")[0]

      if (!acc[key]) return null
      return acc[key][index as any]
    }
    return acc[curr]
  }, obj)
}

export function titleCase(str: string) {
  if (!str) return ""
  const ignore = [
    "and",
    "or",
    "the",
    "a",
    "an",
    "of",
    "in",
    "on",
    "at",
    "to",
    "for",
    "by",
    "with",
    "nor",
    "onto",
    "into",
  ]
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index === 0 || !ignore.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(" ")
}
