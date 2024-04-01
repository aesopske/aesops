import Hero from '@/components/common/Hero'
import BootCamps from '@/components/new/Bootcamps'
import Consultancy from '@/components/new/Consultancy'
import Datasets from '@/components/new/Datasets'
import RecentPosts from '@/components/new/RecentPosts'
// import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
import Heading from '@src/components/common/atoms/Heading'

function Page() {
    return (
        <div className='w-full h-full min-h-screen'>
            <Hero />
            <section id='services'>
                <div className='max-w-screen-xl mx-auto py-40'>
                    <Heading type='h1' className=''>
                        Our Services.
                    </Heading>
                </div>
            </section>
            <Datasets />
            {/* <HasBackgroundWrapper>
                <div className='h-full w-full text-white max-w-screen-xl mx-auto py-48'>
                    <Heading type='h1' className='text-white'>
                        Who is Aesops ?
                    </Heading>
                </div>
            </HasBackgroundWrapper> */}
            <Consultancy />
            <BootCamps />
            <RecentPosts />
            <section className='bg-aes-primary h-96 rounded-3xl container mx-auto max-w-screen-xl'></section>
        </div>
    )
}
export default Page
