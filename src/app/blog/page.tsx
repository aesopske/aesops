import Text from '@src/components/common/atoms/Text'
import Heading from '@components/common/atoms/Heading'
import AesopLink from '@src/components/common/atoms/AesopLink'
import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
import FeaturedPosts from '@src/components/common/organisms/posts/FeaturedPosts'
import CategoryPosts from '@src/components/common/organisms/posts/CategoryPosts'
import PostList from '@src/components/common/organisms/posts/PostList'
import TalkToUs from '@src/components/new/TalkToUs'

function Blog({ searchParams }) {
    return (
        <div className='max-w-screen-xl mx-auto my-6 space-y-16 lg:my-12'>
            <div className='space-y-6 px-5 lg:px-0'>
                <div className='max-w-2xl space-y-3 '>
                    <Heading type='h1'>Blogs</Heading>
                    <Text>
                        Dive deep into the world of data analysis,
                        visualization, and insights. Whether you&apos;re a
                        seasoned data scientist or just beginning your journey
                        in the field, our blog is your go-to resource for all
                        things data.
                    </Text>
                </div>
                <FeaturedPosts />
            </div>

            <hr className='border border-gray-100 max-w-3xl' />

            <div className='relative h-full py-12 px-5 md:py-24 lg:px-0'>
                <HasBackgroundWrapper className='rounded-3xl h-auto max-w-4xl flex items-center mx-auto'>
                    <div className='max-w-xl px-10 py-24 mx-auto space-y-4 md:p-10'>
                        <Heading type='h1' className='text-aes-light'>
                            Hey, we want to hear from you!
                        </Heading>
                        <Text className='text-aes-light'>
                            Find out how you can contribute to our blog and
                            share your story with the world. We are always
                            looking for new perspectives and voices to join our
                            community.
                        </Text>
                        <AesopLink
                            variant='button'
                            color='secondary'
                            href='/blog/contribute'
                            className='mt-4 rounded-full no-underline'>
                            Contribution Guideline &rarr;
                        </AesopLink>
                    </div>
                </HasBackgroundWrapper>
            </div>
            <hr className='border border-gray-100 max-w-3xl' />

            <CategoryPosts search={searchParams?.category} />

            <hr className='border border-gray-100 max-w-3xl' />
            <div className='px-5 xl:px-0 space-y-20'>
                <PostList />
                <TalkToUs />
            </div>
        </div>
    )
}
export default Blog
