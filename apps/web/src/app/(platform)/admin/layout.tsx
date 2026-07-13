import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@repo/auth'
import { isAdminEmail } from '@/lib/platform/admin'

export const metadata = { title: 'Admin | Aesops' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/sign-in')
    if (!isAdminEmail(session.user.email)) redirect('/')

    return (
        <main className='mx-auto max-w-4xl px-6 py-10'>
            <h1 className='font-sans font-light text-2xl text-foreground'>Admin</h1>
            <div className='mt-8'>{children}</div>
        </main>
    )
}
