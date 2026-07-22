import { redirect, notFound } from 'next/navigation'
import { getVerifiedSession } from '@/lib/platform/session'
import { api } from '@/trpc/server'
import { EditForm } from './_components/edit-form'
import BreadCrumbs from '@/components/common/organisms/bread-crumbs/BreadCrumbs'

type Props = { params: Promise<{ slug: string }> }

export default async function EditDatasetPage({ params }: Props) {
    const { slug } = await params

    let doc: Awaited<ReturnType<typeof api.documents.getById>>
    try {
        doc = await api.documents.getById({ id: slug })
    } catch {
        notFound()
    }

    const session = await getVerifiedSession()
    if (!session) redirect(`/sign-in?from=/datasets/${slug}/edit`)
    if (doc.uploadedBy !== session.user.id) redirect(`/datasets/${doc.slug ?? doc.id}`)

    return (
        <main>
            <section className='relative overflow-hidden bg-primary'>
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <svg className='absolute inset-0 w-full h-full pointer-events-none' aria-hidden='true'>
                    <line x1='0' y1='80%' x2='60%' y2='0' stroke='rgba(248,243,237,0.03)' strokeWidth='1' />
                    <line x1='40%' y1='100%' x2='100%' y2='10%' stroke='rgba(248,243,237,0.03)' strokeWidth='1' />
                </svg>
                <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />

                <div className='relative z-10 mx-auto max-w-3xl px-6 py-10 lg:py-12'>
                    <BreadCrumbs color='light' className='mb-6' />
                    <h1 className='font-sans font-light text-3xl md:text-4xl tracking-tight text-primary-foreground'>
                        Edit dataset
                    </h1>
                    <p className='mt-2 max-w-md truncate text-sm text-primary-foreground/55'>
                        {doc.name}
                    </p>
                </div>
            </section>

            <div className='mx-auto max-w-3xl px-6 py-10'>
                <EditForm
                    doc={{
                        id: doc.id,
                        slug: doc.slug ?? null,
                        name: doc.name,
                        description: doc.description,
                        license: doc.license,
                        source: doc.source,
                    }}
                />
            </div>
        </main>
    )
}
