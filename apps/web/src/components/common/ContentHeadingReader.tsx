'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { PortableTextBlock } from '@portabletext/react'
import { cn } from '@/lib/utils'
import parseOutline from '~sanity/utils/parseOutline'

type HeadingNode = {
    text: string
    slug: string
    subheadings: HeadingNode[]
}

type ContentHeadingReaderProps = {
    body: PortableTextBlock[] | undefined
} & React.HTMLAttributes<HTMLDivElement>

function flattenHeadings(nodes: HeadingNode[]): HeadingNode[] {
    return nodes.flatMap((n) => [n, ...flattenHeadings(n.subheadings ?? [])])
}

function ContentHeadingReader({ body, className }: ContentHeadingReaderProps) {
    const outline = useMemo<HeadingNode[]>(() => (body ? parseOutline(body) : []), [body])
    const [activeId, setActiveId] = useState<string>('')
    const pathname = usePathname()

    useEffect(() => {
        const ids = flattenHeadings(outline)
            .map((h) => h.slug)
            .filter(Boolean)
        if (ids.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top - b.boundingClientRect.top,
                    )
                if (visible.length > 0) setActiveId(visible[0]!.target.id)
            },
            { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
        )

        ids.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [body, outline])

    if (!outline || outline.length === 0) return null

    return (
        <div className={cn('flex flex-col gap-3', className)}>
            <span className='text-[10px] font-mono font-medium tracking-[0.18em] uppercase text-muted-foreground'>
                In this article
            </span>
            <div className='w-5 h-px bg-primary/40' />
            <TOCList
                outline={outline}
                activeId={activeId}
                pathname={pathname}
            />
        </div>
    )
}

function TOCList({
    outline,
    activeId,
    pathname,
    depth = 0,
}: {
    outline: HeadingNode[]
    activeId: string
    pathname: string
    depth?: number
}) {
    return (
        <ol
            className={cn(
                'flex flex-col gap-0.5',
                depth > 0 && 'pl-3 mt-0.5 border-l border-border/60',
            )}>
            {outline.map((heading) => {
                const isActive = activeId === heading.slug
                return (
                    <li key={heading.slug}>
                        <Link
                            href={{ pathname, hash: heading.slug }}
                            className={cn(
                                'block text-sm leading-snug py-1 transition-colors duration-150 font-sans',
                                isActive
                                    ? 'text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}>
                            {heading.text}
                        </Link>
                        {heading.subheadings?.length > 0 && (
                            <TOCList
                                outline={heading.subheadings}
                                activeId={activeId}
                                pathname={pathname}
                                depth={depth + 1}
                            />
                        )}
                    </li>
                )
            })}
        </ol>
    )
}

export default ContentHeadingReader
