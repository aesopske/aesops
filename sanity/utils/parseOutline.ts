import speakingUrl from 'speakingurl'

export const getChildrenText = (props: any) => {
    return props?.children.map((node: any) => {
        return typeof node === 'string' ? node : node.text ?? ''
    })
}

const filter = (ast, match) =>
    ast.reduce((acc, node) => {
        if (match(node)) acc.push(node)
        if (node.children) acc.push(...filter(node.children, match))
        return acc
    }, [])
const findHeadings = (ast: any) =>
    filter(ast, (node: any) => /h\d/.test(node.style)).map((node: any) => {
        const text = getChildrenText(node)[0]
        const slug = speakingUrl(text)

        return { ...node, text, slug }
    })

// Outline-audit code
const get = (object: any, path: any[]) => {
    return path.reduce((prev, curr) => prev[curr], object)
}

const getObjectPath = (path: any[]) => {
    return path.length === 0
        ? path
        : ['subheadings'].concat(path.join('.subheadings.').split('.'))
}

const parseOutline = (ast: any[]) => {
    const outline = { subheadings: [] }
    const headings = findHeadings(ast)
    const path = [] as any[]
    let lastLevel = 0

    headings.forEach((heading: any) => {
        const level = Number(heading?.style?.slice(1))
        heading.subheadings = []

        if (level < lastLevel)
            for (let i = lastLevel; i >= level; i--) path.pop()
        else if (level === lastLevel) path.pop()

        const prop = get(outline, getObjectPath(path))
        prop?.subheadings?.push(heading)

        path.push(prop?.subheadings?.length - 1)
        lastLevel = level
    })

    return outline?.subheadings
}

export default parseOutline
