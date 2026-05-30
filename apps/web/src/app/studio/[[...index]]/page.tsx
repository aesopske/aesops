'use client'

import dynamic from 'next/dynamic'
import config from '@apps/web/sanity.config'

const NextStudio = dynamic(
    () => import('next-sanity/studio').then((mod) => mod.NextStudio),
    { ssr: false },
)

export default function StudioPage() {
    return <NextStudio config={config} />
}
