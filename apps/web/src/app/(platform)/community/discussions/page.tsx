import Link from 'next/link'
import { Plus } from 'lucide-react'
import { headers } from 'next/headers'
import { auth } from '@repo/auth'
import { api } from '@/trpc/server'
import { DiscussionBrowser } from '@/components/platform/community/discussion-browser'
import { Button } from '@repo/ui/components/button'
import BreadCrumbs from '@/components/common/organisms/bread-crumbs/BreadCrumbs'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Discussions · Aesops Community' }

export default async function DiscussionsPage() {
    const [session, { items: initialThreads }] = await Promise.all([
        auth.api.getSession({ headers: await headers() }),
        api.community.listThreads({ limit: 20 }),
    ])

    return (
        <div className='relative overflow-hidden'>
            {/* Hero */}
            <section className='relative bg-primary text-primary-foreground'>
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='relative mx-auto max-w-6xl px-6 py-16 lg:py-20'>
                    <BreadCrumbs color='light' className='mb-8' />
                    <div className='flex items-end justify-between gap-4'>
                        <div className='space-y-2'>
                            <h1 className='text-3xl font-semibold tracking-tight'>
                                Discussions
                            </h1>
                            <p className='text-primary-foreground/70 text-sm max-w-md'>
                                Discuss datasets, share insights, and learn from
                                the Aesops data community.
                            </p>
                        </div>
                        {session && (
                            <Button
                                asChild
                                variant='secondary'
                                className='shrink-0 gap-2'>
                                <Link href='/community/discussions/new'>
                                    <Plus size={15} />
                                    New discussion
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Thread list */}
            <div className='mx-auto max-w-6xl px-6 py-20'>
                {!session && (
                    <div className='mb-6 flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3'>
                        <p className='text-sm text-muted-foreground'>
                            Sign in to start a discussion or reply to threads.
                        </p>
                        <Button asChild size='sm' variant='default'>
                            <Link href='/sign-in?from=/community/discussions'>
                                Sign in
                            </Link>
                        </Button>
                    </div>
                )}
                <DiscussionBrowser initialThreads={initialThreads} />
            </div>
        </div>
    )
}
