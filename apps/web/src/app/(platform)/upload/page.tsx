import BreadCrumbs from '@/components/common/organisms/bread-crumbs/BreadCrumbs'
import { UploadFlow } from '@/components/platform/upload/upload-flow'
import { api } from '@/trpc/server'

type Props = { searchParams: Promise<{ revisionOf?: string }> }

export default async function UploadPage({ searchParams }: Props) {
    const { revisionOf: revisionOfId } = await searchParams

    let revisionOf: { id: string; name: string } | null = null
    if (revisionOfId) {
        try {
            const doc = await api.documents.getById({ id: revisionOfId })
            revisionOf = { id: doc.id, name: doc.name }
        } catch {
            // not found — treat as a fresh upload
        }
    }

    return (
        <main className='min-h-screen'>
            <section className='relative overflow-hidden bg-primary'>
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <svg
                    className='absolute inset-0 w-full h-full pointer-events-none'
                    aria-hidden='true'>
                    <line
                        x1='0'
                        y1='80%'
                        x2='60%'
                        y2='0'
                        stroke='rgba(248,243,237,0.03)'
                        strokeWidth='1'
                    />
                    <line
                        x1='40%'
                        y1='100%'
                        x2='100%'
                        y2='10%'
                        stroke='rgba(248,243,237,0.03)'
                        strokeWidth='1'
                    />
                </svg>
                <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />

                <div className='relative z-10 mx-auto max-w-3xl px-6 py-10 lg:py-12'>
                    <BreadCrumbs color='light' className='mb-6' />
                    <h1 className='font-sans font-light text-3xl md:text-4xl tracking-tight text-primary-foreground'>
                        {revisionOf ? 'Upload new version' : 'Upload dataset'}
                    </h1>
                    <p className='mt-2 max-w-md text-sm text-primary-foreground/55'>
                        CSV and Excel files (.csv, .xls, .xlsx) up to 32 MB.
                        Metadata is extracted automatically on your device
                        before upload.
                    </p>
                </div>
            </section>

            <div className='mx-auto max-w-3xl px-6 py-20'>
                <UploadFlow revisionOf={revisionOf} />
            </div>
        </main>
    )
}
