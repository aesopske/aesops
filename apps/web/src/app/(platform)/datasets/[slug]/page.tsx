import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import {
    Download,
    FileSpreadsheet,
    FileText,
    Rows3,
    Columns3,
    HardDrive,
    Sheet,
    Pencil,
} from 'lucide-react'
import Link from 'next/link'
import { auth } from '@repo/auth'
import { db } from '@repo/db'
import { api } from '@/trpc/server'
import { AuthGate } from '@/components/shared/auth-gate'
import { MetadataPanel } from '@/components/platform/dataset/dataset-card'
import { DatasetInsights } from '@/components/platform/dataset/dataset-insights'
import { DatasetChatWidget } from '@/components/platform/dataset/dataset-chat-widget'
import { DatasetVersionHistory } from '@/components/platform/dataset/dataset-version-history'
import { DatasetPageLayout } from '@/components/platform/dataset/dataset-page-layout'
import { DatasetVisualizations } from '@/components/platform/dataset/dataset-visualizations'
import { formatBytes, timeAgo } from '@/lib/platform/format'
import type { DocumentMetadata } from '@repo/db/schema'
import BreadCrumbs from '@/components/common/organisms/bread-crumbs/BreadCrumbs'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    try {
        const doc = await api.documents.getById({ id: slug })
        return { title: `${doc.name} | Aesops Datasets` }
    } catch {
        return { title: 'Dataset | Aesops Datasets' }
    }
}

export default async function DatasetPage({ params }: Props) {
    const { slug } = await params
    let doc: Awaited<ReturnType<typeof api.documents.getById>>

    try {
        doc = await api.documents.getById({ id: slug })
    } catch {
        notFound()
    }

    const session = await auth.api.getSession({ headers: await headers() })
    const isLoggedIn = !!session
    const isOwner = !!session && doc.uploadedBy === session.user.id

    const chatHistory = session
        ? await db.query.chatMessages.findMany({
              where: (t, { and, eq }) =>
                  and(eq(t.datasetId, doc.id), eq(t.userId, session.user.id)),
              orderBy: (t, { asc }) => [asc(t.createdAt)],
          })
        : []

    const revisions =
        doc.parentId === null
            ? await api.documents.listRevisions({ parentId: doc.id })
            : []
    const revisionCount = revisions.length
    const latestRevisionAt = revisions.length > 0 ? revisions[revisions.length - 1].createdAt : null

    const meta = doc.metadata as DocumentMetadata | null
    const isExcel =
        doc.mimeType.includes('excel') || doc.mimeType.includes('spreadsheet')
    const fileType = isExcel ? 'Excel' : 'CSV'

    return (
        <main className='flex flex-col'>
            {/* ── Hero ── */}
            <section className='relative flex-none overflow-hidden bg-primary'>
                {/* dot-grid texture */}
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />

                {/* diagonal scan lines */}
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

                {/* vignette */}
                <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />

                <div className='relative z-10 mx-auto max-w-5xl px-6 py-12 lg:py-16'>
                    <BreadCrumbs color='light' className='mb-8' />

                    {/* file identity */}
                    <div className='flex items-start justify-between gap-6'>
                        <div className='flex items-start gap-5 min-w-0'>
                            <div
                                className={`shrink-0 rounded-xl p-3.5 ${isExcel ? 'bg-success/20 text-success' : 'bg-primary-foreground/15 text-primary-foreground'}`}>
                                {isExcel ? (
                                    <FileSpreadsheet size={26} />
                                ) : (
                                    <FileText size={26} />
                                )}
                            </div>
                            <div className='min-w-0'>
                                <h1 className='font-sans font-light text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1] text-primary-foreground'>
                                    {doc.name}
                                </h1>
                                <p className='mt-2 text-sm text-primary-foreground/55'>
                                    {fileType} · {formatBytes(doc.size)} ·
                                    uploaded {timeAgo(doc.createdAt)}
                                </p>
                                {revisionCount > 0 && (
                                    <p className='mt-1 flex items-center gap-2 text-xs text-primary-foreground/40'>
                                        <span className='rounded-full bg-primary-foreground/10 px-2 py-0.5 font-mono'>
                                            v{revisionCount + 1}
                                        </span>
                                        updated {timeAgo(latestRevisionAt!)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='flex shrink-0 items-center gap-2'>
                            {isOwner && (
                                <Link
                                    href={`/datasets/${doc.slug ?? doc.id}/edit`}
                                    className='inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20'
                                >
                                    <Pencil size={15} />
                                    Edit
                                </Link>
                            )}
                            <AuthGate isLoggedIn={isLoggedIn}>
                                <a
                                    href={`/api/download/${doc.id}`}
                                    className='inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90'
                                >
                                    <Download size={15} />
                                    Download
                                </a>
                            </AuthGate>
                        </div>
                    </div>

                    {/* stat band */}
                    {meta && (
                        <div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4'>
                            {[
                                {
                                    icon: <Rows3 size={14} />,
                                    value: meta.rowCount.toLocaleString(),
                                    label: 'Rows',
                                },
                                {
                                    icon: <Columns3 size={14} />,
                                    value: String(meta.columnCount),
                                    label: 'Columns',
                                },
                                {
                                    icon: <HardDrive size={14} />,
                                    value: formatBytes(doc.size),
                                    label: 'Size',
                                },
                                {
                                    icon: <Sheet size={14} />,
                                    value: meta.analyzedSheet ?? fileType,
                                    label: meta.analyzedSheet
                                        ? 'Sheet'
                                        : 'Format',
                                },
                            ].map(({ icon, value, label }) => (
                                <div
                                    key={label}
                                    className='flex flex-col gap-2 rounded-xl border border-primary-foreground/15 bg-primary-foreground/8 px-5 py-4 backdrop-blur-sm'>
                                    <div className='flex items-center gap-2 text-primary-foreground/55'>
                                        {icon}
                                        <span className='text-[11px] font-medium uppercase tracking-wider'>
                                            {label}
                                        </span>
                                    </div>
                                    <p className='font-mono text-xl font-bold text-primary-foreground leading-none truncate'>
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Content ── */}
            <DatasetPageLayout
                left={
                    <>
                        <AuthGate isLoggedIn={isLoggedIn}>
                            {meta && (
                                <section>
                                    <SectionHeading label='AI insights' />
                                    <div className='mt-4'>
                                        <DatasetInsights
                                            datasetId={doc.id}
                                            cachedInsights={doc.aiInsights ?? null}
                                        />
                                    </div>
                                </section>
                            )}
                        </AuthGate>

                        {doc.parentId === null && revisions.length > 0 && (
                            <DatasetVersionHistory documentId={doc.id} revisions={revisions} />
                        )}

                        <section>
                            <SectionHeading
                                label='Column schema'
                                aside={meta ? `${meta.columnCount} columns` : undefined}
                            />
                            <div className='mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
                                {meta ? (
                                    <div className='overflow-x-auto p-6'>
                                        <MetadataPanel meta={meta} />
                                    </div>
                                ) : (
                                    <p className='px-6 py-10 text-center text-sm text-muted-foreground'>
                                        No metadata available for this dataset.
                                    </p>
                                )}
                            </div>
                        </section>
                    </>
                }
                right={
                    meta ? (
                        <section>
                            <SectionHeading label='Data overview' />
                            <div className='mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
                                <div className='p-6'>
                                    <DatasetVisualizations meta={meta} />
                                </div>
                            </div>
                        </section>
                    ) : null
                }
            />

            {/* ── Floating chat widget (auth-gated) ── */}
            {isLoggedIn && meta && (
                <DatasetChatWidget
                    datasetId={doc.id}
                    initialMessages={chatHistory}
                />
            )}
        </main>
    )
}

function SectionHeading({ label, aside }: { label: string; aside?: string }) {
    return (
        <div className='flex items-center gap-3'>
            <span className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                {label}
            </span>
            <div className='h-px flex-1 bg-border' />
            {aside && (
                <span className='font-mono text-[11px] text-muted-foreground'>
                    {aside}
                </span>
            )}
        </div>
    )
}
