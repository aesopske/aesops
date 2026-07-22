import Link from 'next/link'
import { getVerifiedSession } from '@/lib/platform/session'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Navbar } from '@repo/ui/components/navbar'
import { UserDropdown } from '@/components/platform/nav/user-dropdown'
import { AuthNavLinks } from '@/components/platform/nav/auth-nav-links'
import { getNavLinks } from '~sanity/utils/requests'
import Footer from '@/components/common/Footer'
import { isAdminEmail } from '@/lib/platform/admin'

export default async function PlatformLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [session, navLinks] = await Promise.all([
        getVerifiedSession(),
        getNavLinks(),
    ])
    const user = session?.user

    const initials = user
        ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : ''

    const rightSlot = user ? (
        <>
            <Link
                href='/upload'
                className='rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85'>
                Upload
            </Link>
            <UserDropdown
                name={user.name}
                email={user.email}
                image={user.image}
                initials={initials}
                isAdmin={isAdminEmail(user.email)}
            />
        </>
    ) : (
        <AuthNavLinks />
    )

    return (
        <NuqsAdapter>
            <Navbar
                navLinks={navLinks}
                rightSlot={rightSlot}
                navAlign='right'
            />
            <main className='min-h-screen'>{children}</main>
            {!user && <Footer />}
        </NuqsAdapter>
    )
}
