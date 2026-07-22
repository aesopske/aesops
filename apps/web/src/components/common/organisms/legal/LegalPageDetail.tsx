import ContentReader from '@components/common/ContentReader'
import { PAGE } from '~sanity/utils/types'
import BreadCrumbs from '../bread-crumbs/BreadCrumbs'

type Props = {
    page: PAGE
}

function LegalPageDetail({ page }: Props) {
    return (
        <>
            {/* ── Hero header ───────────────────────────────── */}
            <section className='relative bg-primary overflow-hidden'>
                <div
                    className='absolute inset-0 opacity-[0.07]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                    }}
                />
                <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25' />

                <div className='relative z-10 mx-auto max-w-(--breakpoint-md) px-6 lg:px-8 pt-8 pb-10 lg:pt-10 lg:pb-12'>
                    <BreadCrumbs color='light' className='mb-6' />
                    <h1 className='font-sans font-light text-3xl lg:text-4xl text-primary-foreground tracking-tight leading-[1.1]'>
                        {page.title}
                    </h1>
                </div>
            </section>

            {/* ── Body ──────────────────────────────────────── */}
            <section className='bg-background py-12 lg:py-16'>
                <div className='mx-auto max-w-(--breakpoint-md) px-6 lg:px-8'>
                    {page.body && <ContentReader content={page.body} />}
                </div>
            </section>
        </>
    )
}

export default LegalPageDetail
