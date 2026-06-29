import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@repo/auth'
import { db, accounts, eq } from '@repo/db'
import { SignOutButton } from './_components/sign-out-button'

export const metadata = { title: 'Account | Aesops' }

function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatDateTime(date: Date) {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

function providerLabel(providerId: string) {
    const labels: Record<string, string> = {
        github: 'GitHub',
        google: 'Google',
        credential: 'Email',
    }
    return labels[providerId] ?? providerId
}

export default async function AccountPage() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/sign-in')

    const { user } = session

    const linkedAccounts = await db
        .select({ providerId: accounts.providerId })
        .from(accounts)
        .where(eq(accounts.userId, user.id))

    const signInMethods = linkedAccounts.map((a) => providerLabel(a.providerId)).join(', ')

    const initials = user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div>
            {/* Account */}
            <h2 className='text-lg font-medium text-foreground'>Account</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>Your profile and sign-in details.</p>

            <div className='mt-4 rounded-xl border border-border bg-card p-6'>
                <div className='flex items-center gap-4'>
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name}
                            className='h-12 w-12 rounded-full object-cover ring-2 ring-border'
                        />
                    ) : (
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-border'>
                            {initials}
                        </div>
                    )}
                    <div>
                        <p className='font-medium text-foreground'>{user.name}</p>
                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                    </div>
                </div>

                <div className='my-5 border-t border-border' />

                <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <div>
                        <dt className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                            Member since
                        </dt>
                        <dd className='mt-1 text-sm text-foreground'>{formatDate(user.createdAt)}</dd>
                    </div>
                    <div>
                        <dt className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                            Sign-in method
                        </dt>
                        <dd className='mt-1 text-sm text-foreground'>{signInMethods || '—'}</dd>
                    </div>
                    <div>
                        <dt className='font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                            Last login
                        </dt>
                        <dd className='mt-1 text-sm text-foreground'>
                            {formatDateTime(session.session.updatedAt)}
                        </dd>
                    </div>
                </dl>
            </div>

            {/* Session */}
            <h2 className='mt-8 text-lg font-medium text-foreground'>Session</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>Manage your active session.</p>

            <div className='mt-4 rounded-xl border border-border bg-card'>
                <div className='flex items-center justify-between px-6 py-4'>
                    <div>
                        <p className='text-sm font-medium text-foreground'>Sign out</p>
                        <p className='text-sm text-muted-foreground'>Sign out of your account on this device.</p>
                    </div>
                    <SignOutButton />
                </div>
            </div>

            {/* Danger zone */}
            <h2 className='mt-8 text-lg font-medium text-foreground'>Danger zone</h2>
            <p className='mt-0.5 text-sm text-muted-foreground'>Irreversible and destructive actions.</p>

            <div className='mt-4 rounded-xl border border-destructive/20 bg-destructive/[0.02] divide-y divide-destructive/10'>
                <div className='flex items-center justify-between px-6 py-4'>
                    <div>
                        <p className='text-sm font-medium text-foreground'>Delete account</p>
                        <p className='text-sm text-muted-foreground'>
                            Permanently delete your account, datasets, and all data.
                        </p>
                    </div>
                    <button
                        disabled
                        className='cursor-not-allowed rounded-lg border border-destructive/30 px-4 py-2 text-sm text-destructive opacity-60'>
                        Delete account
                    </button>
                </div>
            </div>
        </div>
    )
}
