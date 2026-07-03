'use client'

import { Download, ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { formatBytes } from '@/lib/platform/format'
import type { DocumentMetadata } from '@repo/db/schema'

export type VersionInfo = {
    id: string
    versionNumber: number
    size: number
    metadata: DocumentMetadata | null
    createdAt: Date
}

type Props = {
    rootId: string
    rootName: string
    versions: VersionInfo[]
    isLoggedIn?: boolean
    fallback?: React.ReactNode
}

export function DownloadButton({
    rootId,
    rootName,
    versions,
    isLoggedIn = true,
    fallback,
}: Props) {
    // Single version: render as simple button
    if (versions.length <= 1) {
        if (!isLoggedIn && fallback) return fallback

        return (
            <a
                href={`/api/download/${rootId}`}
                className='inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90'>
                <Download size={15} />
                Download
            </a>
        )
    }

    // Multiple versions: dropdown menu
    if (!isLoggedIn && fallback) return fallback

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90'>
                    <Download size={15} />
                    Download
                    <ChevronDown size={14} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
                {versions.map((version) => (
                    <DropdownMenuItem
                        key={version.id}
                        asChild
                        className='focus:bg-primary/15'>
                        <a
                            href={`/api/download/${rootId}?version=${version.versionNumber}`}>
                            <div className='flex flex-col gap-1'>
                                <span className='font-medium'>
                                    v{version.versionNumber}
                                    {version.versionNumber === 1 &&
                                        ' (Original)'}
                                </span>
                                {version.metadata && (
                                    <span className='text-xs text-muted-foreground'>
                                        {version.metadata.rowCount.toLocaleString()}{' '}
                                        rows · {formatBytes(version.size)}
                                    </span>
                                )}
                            </div>
                        </a>
                    </DropdownMenuItem>
                ))}

                {versions.length > 1 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            asChild
                            className='focus:bg-primary/15'>
                            <a href={`/api/download/${rootId}?version=merged`}>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-medium'>Merged</span>
                                    <span className='text-xs text-muted-foreground'>
                                        All versions combined
                                    </span>
                                </div>
                            </a>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
