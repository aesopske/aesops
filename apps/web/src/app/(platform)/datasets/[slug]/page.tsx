import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
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
import { getVerifiedSession } from '@/lib/platform/session'
import { api } from '@/trpc/server'
import { AuthGate } from '@/components/shared/auth-gate'
import { MetadataPanel } from '@/components/platform/dataset/dataset-card'
import { DatasetInsights } from '@/components/platform/dataset/dataset-insights'
import { DatasetVersionHistory } from '@/components/platform/dataset/dataset-version-history'
import { DatasetPageLayout } from '@/components/platform/dataset/dataset-page-layout'
import { DatasetVisualizations } from '@/components/platform/dataset/dataset-visualizations'
import { TrendSection } from '@/components/platform/dataset/time-series-chart'
import { RelatedDiscussions } from '@/components/platform/community/related-discussions'
import { formatBytes, formatDate } from '@/lib/platform/format'
import { classifyTimeSeries } from '@/lib/platform/time-series'
import type { DocumentMetadata } from '@repo/db/schema'
import BreadCrumbs from '@/components/common/organisms/bread-crumbs/BreadCrumbs'
import { DownloadButton } from '@/components/platform/dataset/download-button'
import { DownloadAnalytics } from '@/components/platform/dataset/download-analytics'
import { DATASET_CATEGORIES } from '@/lib/constants/dataset-taxonomy'
import { ChatWidgetSection } from './_components/chat-widget-section'
import { TrendSkeleton } from './_components/trend-skeleton'

const CATEGORY_LABELS: Map<string, string> = new Map(
    DATASET_CATEGORIES.map((c) => [c.value, c.label]),
)

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

    const [session, revisions] = await Promise.all([
        getVerifiedSession(),
        doc.parentId === null
            ? api.documents.listRevisions({ parentId: doc.id })
            : Promise.resolve([]),
    ])
    const isLoggedIn = !!session
    const isOwner = !!session && doc.uploadedBy === session.user.id

    const revisionCount = revisions.length
    const latestRevisionAt =
        revisions.length > 0 ? revisions.at(-1)!.createdAt : null

    const meta = doc.metadata as DocumentMetadata | null
    const timeSeries = classifyTimeSeries(meta)
    const isExcel =
        doc.mimeType.includes('excel') || doc.mimeType.includes('spreadsheet')
    const fileType = isExcel ? 'Excel' : 'CSV'

    return (
        <main className={`relative flex flex-col overflow-x-auto`}>
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

                <div className='relative z-10 mx-auto max-w-6xl px-6 py-12 lg:py-16'>
                    <BreadCrumbs color='light' className='mb-8' />

                    {/* file identity */}
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6'>
                        <div className='flex items-start gap-4 min-w-0'>
                            <div
                                className={`shrink-0 rounded-xl p-3 sm:p-3.5 ${isExcel ? 'bg-success/20 text-success' : 'bg-primary-foreground/15 text-primary-foreground'}`}>
                                {isExcel ? (
                                    <FileSpreadsheet size={22} />
                                ) : (
                                    <FileText size={22} />
                                )}
                            </div>
                            <div className='min-w-0'>
                                <h1 className='break-words font-sans font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1] text-primary-foreground max-w-2xl'>
                                    {doc.name}
                                </h1>
                                <div className='mt-2 flex flex-wrap items-center gap-2 text-sm text-primary-foreground/55'>
                                    {revisionCount > 0 && (
                                        <span className='rounded-full bg-primary-foreground/10 px-2 py-0.5 font-mono text-xs'>
                                            v{revisionCount + 1}
                                        </span>
                                    )}
                                    <span>{fileType}</span>
                                    {doc.source && (
                                        <>
                                            <span className='text-primary-foreground/30'>
                                                ·
                                            </span>
                                            {/^https?:\/\//.test(doc.source) ? (
                                                <a
                                                    href={doc.source}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='shrink-0 underline decoration-primary-foreground/30 underline-offset-2 hover:text-primary-foreground'>
                                                    Source
                                                </a>
                                            ) : (
                                                <span className='min-w-0 truncate'>
                                                    {doc.source}
                                                </span>
                                            )}
                                        </>
                                    )}
                                    <span className='text-primary-foreground/30'>
                                        ·
                                    </span>
                                    <span className='text-primary-foreground/40'>
                                        Uploaded {formatDate(doc.createdAt)}
                                        {revisionCount > 0 && (
                                            <>
                                                {' '}
                                                &bull; Updated{' '}
                                                {formatDate(latestRevisionAt!)}
                                            </>
                                        )}
                                    </span>
                                </div>
                                {(doc.category || doc.tags?.length) && (
                                    <div className='mt-3 flex flex-wrap items-center gap-1.5'>
                                        {doc.category && (
                                            <span className='rounded-full bg-primary-foreground/15 px-2.5 py-0.5 text-xs font-medium text-primary-foreground'>
                                                {CATEGORY_LABELS.get(doc.category) ??
                                                    doc.category}
                                            </span>
                                        )}
                                        {doc.tags?.map((tag) => (
                                            <span
                                                key={tag}
                                                className='rounded-full bg-primary-foreground/10 px-2.5 py-0.5 text-xs text-primary-foreground/70'>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='flex shrink-0 items-center gap-2 sm:mt-1'>
                            {isOwner && (
                                <Link
                                    href={`/datasets/${doc.slug ?? doc.id}/edit`}
                                    className='inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20'>
                                    <Pencil size={15} />
                                    Edit
                                </Link>
                            )}
                            <AuthGate
                                isLoggedIn={isLoggedIn}
                                fallback={
                                    <Link
                                        href={`/sign-in?from=/datasets/${doc.slug ?? doc.id}`}
                                        className='inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-2.5 text-sm font-medium text-primary transition-opacity hover:opacity-90'>
                                        <Download size={15} />
                                        Download
                                    </Link>
                                }>
                                <DownloadButton
                                    latestVersionId={
                                        revisions.length > 0
                                            ? revisions[revisions.length - 1]!
                                                  .id
                                            : doc.id
                                    }
                                    isLoggedIn={isLoggedIn}
                                />
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
                        {timeSeries.isTimeSeries && (
                            <Suspense fallback={<TrendSkeleton />}>
                                <TrendSection
                                    doc={doc}
                                    time={timeSeries.time}
                                    valueColumns={timeSeries.valueColumns}
                                />
                            </Suspense>
                        )}

                        {meta && (
                            <section className='order-2 lg:order-none'>
                                <SectionHeading label='Insights' />
                                <div className='mt-4'>
                                    <DatasetInsights
                                        cachedInsights={doc.aiInsights ?? null}
                                    />
                                </div>
                            </section>
                        )}

                        {doc.parentId === null && revisions.length > 0 && (
                            <div className='order-3 lg:order-none'>
                                <DatasetVersionHistory
                                    documentId={doc.id}
                                    root={{
                                        name: doc.name,
                                        size: doc.size,
                                        createdAt: doc.createdAt,
                                    }}
                                    revisions={revisions}
                                />
                            </div>
                        )}

                        <section className='order-6 lg:order-none'>
                            <SectionHeading label='Community discussions' />
                            <div className='mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
                                <div className='p-6'>
                                    <RelatedDiscussions
                                        datasetId={doc.id}
                                        datasetSlug={doc.slug ?? null}
                                        datasetName={doc.name}
                                    />
                                </div>
                            </div>
                        </section>

                        {isOwner && (
                            <section className='order-7 lg:order-none'>
                                <SectionHeading label='Downloads' />
                                <div className='mt-4 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm'>
                                    <DownloadAnalytics
                                        documentId={
                                            revisions.length > 0
                                                ? revisions[
                                                      revisions.length - 1
                                                  ]!.id
                                                : doc.id
                                        }
                                    />
                                </div>
                            </section>
                        )}
                    </>
                }
                right={
                    <>
                        {meta && (
                            <section className='order-4 lg:order-none'>
                                <SectionHeading label='Data overview' />
                                <div className='mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
                                    <div className='p-6'>
                                        <DatasetVisualizations meta={meta} />
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className='order-5 lg:order-none'>
                            <SectionHeading
                                label='Column schema'
                                aside={
                                    meta
                                        ? `${meta.columnCount} columns`
                                        : undefined
                                }
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
            />

            {/* ── Floating chat widget (auth-gated) ── */}
            {session && meta && (
                <Suspense fallback={null}>
                    <ChatWidgetSection datasetId={doc.id} session={session} />
                </Suspense>
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
