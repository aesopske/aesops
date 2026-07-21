import Link from 'next/link'
import { getVerifiedSession } from '@/lib/platform/session'
import { ProfileSidebar } from './_components/profile-sidebar'

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    const session = await getVerifiedSession()

    if (!session) {
        return (
            <main className='flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-12'>
                <div className='text-center'>
                    <h1 className='font-sans font-light text-3xl text-foreground'>
                        Sign in to manage your datasets
                    </h1>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Upload datasets and manage them from one place.
                    </p>
                    <div className='mt-8 flex items-center justify-center gap-3'>
                        <Link
                            href='/sign-in'
                            className='rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                            Sign in
                        </Link>
                        <Link
                            href='/sign-up'
                            className='rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary'>
                            Create account
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const { user } = session
    const initials = user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <main>
            {/* hero */}
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

                <div className='relative z-10 mx-auto max-w-4xl px-6 py-10 lg:py-12'>
                    <div className='flex items-center justify-between gap-6'>
                        <div className='flex items-center gap-5'>
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className='h-14 w-14 rounded-full object-cover ring-2 ring-primary-foreground/20'
                                />
                            ) : (
                                <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground/15 text-lg font-semibold text-primary-foreground ring-2 ring-primary-foreground/20'>
                                    {initials}
                                </div>
                            )}
                            <div>
                                <h1 className='font-sans font-light text-2xl md:text-3xl text-primary-foreground'>
                                    {user.name}
                                </h1>
                                <p className='mt-0.5 text-sm text-primary-foreground/55'>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* sidebar + content */}
            <div className='mx-auto max-w-4xl px-6 py-10'>
                <div className='flex gap-10'>
                    <aside className='w-44 shrink-0'>
                        <ProfileSidebar />
                    </aside>
                    <div className='min-w-0 flex-1'>{children}</div>
                </div>
            </div>
        </main>
    )
}
