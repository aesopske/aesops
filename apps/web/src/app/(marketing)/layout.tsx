import { draftMode } from 'next/headers'
import Footer from '@components/common/Footer'
import NewNavbar from '@components/common/NewNavbar'
import { NavRightSlot } from '@/components/platform/nav/nav-right-slot'
import { getNavLinks } from '~sanity/utils/requests'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const [{ isEnabled }, navLinks] = await Promise.all([draftMode(), getNavLinks()])

    return (
        <>
            <NewNavbar
                previewEnabled={isEnabled}
                navLinks={navLinks}
                rightSlot={<NavRightSlot />}
                navAlign='right'
                logoMarkSrc='/logo-mark.svg'
            />
            <main>{children}</main>
            <Footer />
        </>
    )
}
