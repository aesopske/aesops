import Link from 'next/link'
import { Database, BookOpen } from 'lucide-react'

type Props = {
    linkedDatasetId?: string | null
    linkedDatasetSlug?: string | null
    linkedDatasetName?: string | null
    linkedBlogId?: string | null
    linkedBlogSlug?: string | null
    linkedBlogTitle?: string | null
    variant?: 'default' | 'dark'
    // render the label as plain text instead of a link (e.g. inside a clickable card)
    static?: boolean
}

export function ThreadSourceBadge({
    linkedDatasetId,
    linkedDatasetSlug,
    linkedDatasetName,
    linkedBlogId,
    linkedBlogSlug,
    linkedBlogTitle,
    variant = 'default',
    static: isStatic = false,
}: Props) {
    const spanCls =
        variant === 'dark'
            ? 'inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-0.5 text-xs text-primary-foreground/70'
            : 'inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground'
    const linkCls =
        variant === 'dark'
            ? 'hover:underline underline-offset-2 hover:text-primary-foreground'
            : 'hover:underline underline-offset-2 hover:text-foreground'

    if (linkedDatasetId && linkedDatasetName) {
        const href = `/datasets/${linkedDatasetSlug ?? linkedDatasetId}`
        return (
            <span className={spanCls}>
                <Database size={10} />
                {isStatic ? (
                    <span>{linkedDatasetName}</span>
                ) : (
                    <Link href={href} className={linkCls}>
                        {linkedDatasetName}
                    </Link>
                )}
            </span>
        )
    }

    if (linkedBlogId && linkedBlogTitle) {
        const href = linkedBlogSlug ? `/${linkedBlogSlug}` : '#'
        return (
            <span className={spanCls}>
                <BookOpen size={10} />
                {isStatic ? (
                    <span>{linkedBlogTitle}</span>
                ) : (
                    <Link href={href} className={linkCls}>
                        {linkedBlogTitle}
                    </Link>
                )}
            </span>
        )
    }

    return null
}
