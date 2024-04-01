import Text from '@src/components/common/atoms/Text'
import Heading from '@components/common/atoms/Heading'
import AesopLink from '@src/components/common/atoms/AesopLink'
import HasBackgroundWrapper from '@src/components/common/HasBackgroundWrapper'
import FeaturedPosts from '@src/components/common/organisms/posts/FeaturedPosts'
import CategoryPosts from '@src/components/common/organisms/posts/CategoryPosts'
import PostList from '@src/components/common/organisms/posts/PostList'

async function Blog({ searchParams }) {
    return (
        <div className='max-w-screen-xl mx-auto my-12 space-y-16'>
            <div className='space-y-6'>
                <div className='max-w-2xl space-y-3'>
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

            <div className='relative h-full py-24'>
                <HasBackgroundWrapper className='rounded-3xl h-96 max-w-4xl flex items-center mx-auto'>
                    <div className='max-w-xl mx-auto space-y-4 p-10'>
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
                            variant='default'
                            buttonType='secondary'
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
            <PostList />
            <section className='bg-aes-primary h-96 rounded-3xl container mx-auto max-w-screen-xl'></section>
        </div>
    )
}
export default Blog
