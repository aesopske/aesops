export function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function timeAgo(date: string | Date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 86400 * 30) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(date).toLocaleDateString()
}

// Dataset `description` is a Tiptap JSON doc (or plain string for legacy
// records) — flatten it to plain text for compact list/card previews.
export function extractDescription(raw: unknown): string {
    if (!raw) return ''
    if (typeof raw === 'string') return raw
    const doc = raw as { content?: { content?: { text?: string }[] }[] }
    return (
        doc.content
            ?.flatMap((block) => block.content ?? [])
            .map((node) => node.text ?? '')
            .join('') ?? ''
    )
}

// AI-generated insights lead with a "SUMMARY: ..." line (see
// lib/platform/insights.ts) — split it out so it can stand in for a missing
// uploader-written description, and so the insights panel doesn't repeat it.
export function parseInsightsSummary(aiInsights: string | null | undefined): {
    summary: string
    body: string
} {
    if (!aiInsights) return { summary: '', body: '' }
    const trimmed = aiInsights.trimStart()
    const match = trimmed.match(/^SUMMARY:\s*(.+?)\s*\n+/)
    if (!match) return { summary: '', body: aiInsights }
    return { summary: match[1]!.trim(), body: trimmed.slice(match[0].length).trim() }
}
