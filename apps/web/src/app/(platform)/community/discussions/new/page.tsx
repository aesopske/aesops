import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { auth } from '@repo/auth'
import { CreateThreadForm } from '@/components/platform/community/create-thread-form'
import BreadCrumbs from '@/components/common/organisms/bread-crumbs/BreadCrumbs'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Discussion · Aesops Community' }

export default async function NewThreadPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/sign-in?from=/community/discussions/new')

    return (
        <main className='flex flex-col'>
            <section className='relative bg-primary overflow-hidden'>
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/20' />
                <div className='relative z-10 mx-auto max-w-2xl px-6 py-10 lg:py-14'>
                    <BreadCrumbs color='light' className='mb-8' />
                    <h1 className='font-sans font-light text-3xl md:text-4xl tracking-tight leading-[1.15] text-primary-foreground'>
                        Start a discussion
                    </h1>
                    <p className='mt-2 text-sm text-primary-foreground/60'>
                        Share a topic with the Aesops community. Optionally link
                        it to a dataset or blog post.
                    </p>
                </div>
            </section>

            <div className='mx-auto w-full max-w-2xl px-6 py-10'>
                <Suspense>
                    <CreateThreadForm />
                </Suspense>
            </div>
        </main>
    )
}
