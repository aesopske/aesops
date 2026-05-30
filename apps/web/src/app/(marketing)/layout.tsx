import { headers, draftMode } from 'next/headers'
import { auth } from '@repo/auth'
import Footer from '@components/common/Footer'
import NewNavbar from '@components/common/NewNavbar'
import { UserDropdown } from '@/components/platform/nav/user-dropdown'
import { AuthNavLinks } from '@/components/platform/nav/auth-nav-links'
import { getNavLinks } from '~sanity/utils/requests'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const [{ isEnabled }, navLinks, session] = await Promise.all([
        draftMode(),
        getNavLinks(),
        auth.api.getSession({ headers: await headers() }),
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
        <UserDropdown
            name={user.name}
            email={user.email}
            image={user.image}
            initials={initials}
        />
    ) : (
        <AuthNavLinks />
    )

    return (
        <>
            <NewNavbar
                previewEnabled={isEnabled}
                navLinks={navLinks}
                rightSlot={rightSlot}
                navAlign='right'
            />
            <main>{children}</main>
            <Footer />
        </>
    )
}
