'use client'

import { Download } from 'lucide-react'

type Props = {
    latestVersionId: string
    isLoggedIn?: boolean
    fallback?: React.ReactNode
}

export function DownloadButton({
    latestVersionId,
    isLoggedIn = true,
    fallback,
}: Props) {
    if (!isLoggedIn && fallback) return fallback

    return (
        <a
            href={`/api/download/${latestVersionId}`}
            className='inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90'>
            <Download size={15} />
            Download
        </a>
    )
}
