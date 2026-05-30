'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadZone } from './upload-zone'
import { UploadForm } from './upload-form'
import { RevisionBanner } from './revision-banner'

type RevisionParent = { id: string; name: string }

type Props = {
    revisionOf?: RevisionParent | null
}

export function UploadFlow({ revisionOf }: Props) {
    const router = useRouter()
    const [files, setFiles] = useState<File[]>([])

    const onComplete = () => {
        router.push(revisionOf ? `/datasets/${revisionOf.id}` : '/profile')
    }

    if (files.length > 0) {
        return (
            <div className='space-y-6'>
                {revisionOf && <RevisionBanner parent={revisionOf} />}
                <UploadForm
                    files={files}
                    parentId={revisionOf?.id}
                    lockedName={revisionOf?.name}
                    onComplete={onComplete}
                    onCancel={() => setFiles([])}
                />
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            {revisionOf && <RevisionBanner parent={revisionOf} />}
            <UploadZone onFilesSelected={setFiles} />
        </div>
    )
}
