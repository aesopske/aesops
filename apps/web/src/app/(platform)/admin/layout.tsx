import { redirect } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { getVerifiedSession } from '@/lib/platform/session'
import { isAdminEmail } from '@/lib/platform/admin'
import { AdminNav } from '@/components/platform/admin/admin-nav'

export const metadata = { title: 'Admin | Aesops' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getVerifiedSession()
    if (!session) redirect('/sign-in')
    if (!isAdminEmail(session.user.email)) redirect('/')

    return (
        <main>
            {/* Hero */}
            <section className='relative overflow-hidden bg-primary'>
                <div
                    className='absolute inset-0 opacity-[0.06]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='relative z-10 mx-auto max-w-5xl px-6 py-10 lg:py-12'>
                    <div className='flex items-center gap-4'>
                        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground'>
                            <LayoutDashboard size={22} />
                        </div>
                        <div>
                            <h1 className='font-sans font-light text-2xl md:text-3xl tracking-tight text-primary-foreground'>
                                Admin
                            </h1>
                            <p className='mt-1 text-sm text-primary-foreground/60'>
                                Platform usage metrics and programmatic
                                access, in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className='mx-auto max-w-5xl px-6 py-8'>
                <AdminNav />
                <div className='mt-8'>{children}</div>
            </div>
        </main>
    )
}
