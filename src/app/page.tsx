import Hero from '@/components/common/Hero'
import BootCamps from '@/components/new/Bootcamps'
import Consultancy from '@/components/new/Consultancy'
import Datasets from '@/components/new/Datasets'
import RecentPosts from '@/components/new/RecentPosts'

function Page() {
    return (
        <div className='w-full h-full min-h-screen'>
            <Hero />
            <Datasets />
            <Consultancy />
            <BootCamps />
            <RecentPosts />
            <section className='bg-aes-primary h-96 rounded-3xl container mx-auto max-w-screen-xl'></section>
        </div>
    )
}
export default Page
