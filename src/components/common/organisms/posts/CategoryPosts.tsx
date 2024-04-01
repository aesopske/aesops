import PostCard from './PostCard'
import Categories from './Categories'
import Text from '@components/common/atoms/Text'
import Heading from '@components/common/atoms/Heading'
import ListWrapper from '@components/common/ListWrapper'
import AesopLink from '@components/common/atoms/AesopLink'
import { CATEGORY_POST, MIN_POST } from '@sanity/lib/types'
import { fetchCategories, fetchCategoryPosts } from '@sanity/lib/requests'

async function CategoryPosts({ search }: { search: string }) {
    const categoryPosts = await fetchCategoryPosts({
        search,
        page: 1,
        limit: 10,
    })
    const categories = await fetchCategories()

    return (
        <div className='grid grid-cols-3 gap-5'>
            <div className='col-span-2 space-y-10'>
                <div className='space-y-2'>
                    <Heading type='h2' className='font-bold'>
                        Category Posts
                    </Heading>
                    <Text className='max-w-xl'>
                        Explore our blog by category. Whether you&apos;re
                        interested in data visualization, machine learning, or
                        data analysis, we have something for everyone.
                    </Text>
                </div>
                <div className='my-2'>
                    <ListWrapper list={categoryPosts} itemKey='slug.current'>
                        {(category: CATEGORY_POST) => (
                            <div className='space-y-5 my-6'>
                                <div className='flex items-center justify-between'>
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
                                        buttonType='link'
                                        href={`/blog?category=${category.slug.current}#${category.slug.current}`}>
                                        View More Posts &rarr;
                                    </AesopLink>
                                </div>
                                <div className='grid grid-cols-3 gap-4'>
                                    <ListWrapper
                                        list={category?.posts}
                                        itemKey='_key'>
                                        {(post: MIN_POST) => (
                                            <PostCard
                                                post={post}
                                                className='h-full'
                                                orientation='vertical'
                                            />
                                        )}
                                    </ListWrapper>
                                </div>
                            </div>
                        )}
                    </ListWrapper>
                </div>
            </div>
            <Categories categories={categories} search={search} />
        </div>
    )
}
export default CategoryPosts
