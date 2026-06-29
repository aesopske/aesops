const PILL_CLASS =
    'font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium'

export function MentionPill({ name }: { name: string }) {
    return <span className={PILL_CLASS}>@{name}</span>
}

export function mentionToHtml(name: string): string {
    return `<span class="${PILL_CLASS}">@${name}</span>`
}

export function highlightMentions(text: string): string {
    return (
        text
            // Strip any number of nested <code> wrappers around a mention
            .replace(/(?:<code[^>]*>)+(@[\w-]+)(?:<\/code>)+/gi, '$1')
            .replace(/@([\w-]+)/g, (_, name: string) => mentionToHtml(name))
    )
}
