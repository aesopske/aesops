import PostCard from './PostCard'
import Categories from './Categories'
import Text from '@components/common/atoms/Text'
import Heading from '@components/common/atoms/Heading'
import ListWrapper from '@components/common/ListWrapper'
import AesopLink from '@components/common/atoms/AesopLink'
import { CATEGORY_POST, MIN_POST } from '@sanity/utils/types'
import { fetchCategories, fetchCategoryPosts } from '@sanity/utils/requests'

async function CategoryPosts({ search }: { search: string }) {
    const categoryPosts = await fetchCategoryPosts({
        search,
        page: 1,
        limit: 10,
    })
    const categories = await fetchCategories()

    return (
        <div className='grid grid-cols-1 order-last gap-5 px-5 lg:grid-cols-3 xl:px-0'>
            <div className='col-span-1  space-y-10 md:col-span-2'>
                <div className='space-y-2'>
                    <Heading type='h2' className='font-bold'>
                        Exciting Categories
                    </Heading>
                    <Text className='max-w-xl'>
                        Explore posts by category. Whether you&apos;re
                        interested in data visualization, machine learning, data
                        analysis e.t.c, we have something for everyone.
                    </Text>
                </div>
                <div className='my-2'>
                    <ListWrapper list={categoryPosts} itemKey='slug.current'>
                        {(category: CATEGORY_POST) => (
                            <div className='space-y-5 my-6'>
                                <div className='flex flex-col item-start justify-between md:flex-row md:items-center'>
                                    <div className='space-y-2'>
                                        <Heading
                                            type='h3'
                                            id={category.slug.current}
                                            className='font-bold'>
                                            {category.title}
                                        </Heading>
                                        <Text className='max-w-xl text-aes-dark/70'>
                                            {category.description}
                                        </Text>
                                    </div>
                                    <AesopLink
                                        variant='default'
                                        href={`/blog?category=${category.slug.current}#${category.slug.current}`}>
                                        View More Posts &rarr;
                                    </AesopLink>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <ListWrapper
                                        list={category?.posts}
                                        itemKey='_key'>
                                        {(post: MIN_POST) => (
                                            <PostCard
                                                post={post}
                                                className='h-full'
                                            />
                                        )}
                                    </ListWrapper>
                                </div>
                            </div>
                        )}
                    </ListWrapper>
                </div>
            </div>
            <Categories
                search={search}
                categories={categories}
                className='order-first md:order-last'
            />
        </div>
    )
}
export default CategoryPosts
