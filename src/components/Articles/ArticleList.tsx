import { useRouter } from 'next/router'
import { useEffect, useState, useCallback, Fragment } from 'react'

import { ARTICLE, CATEGORY } from '@/types'
import Search from '../common/Search'
import ArticleCard from './ArticleCard'
import ArticleLoader from './ArticleLoader'
import Unavailable from '../common/Unavailable'
import FilterByCategory from './FilterByCategory'
import { fetchArticles, fetchCategories } from '@/utils/requests'
import Text from '../common/atoms/Text'
import { X } from 'lucide-react'
import { Button } from '../ui'

type ArticleListProps = {
    articles: ARTICLE[]
}

function ArticleList({ articles }: ArticleListProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [filtered, setFiltered] = useState<ARTICLE[]>([])
    const [categories, setCategories] = useState<CATEGORY[]>([])

    const { category: query, search } = router.query as {
        category: string
        search: string
    }

    const fetchFiltered = useCallback(async (txt: string) => {
        try {
            setLoading(true)
            const data = (await fetchArticles({ keyword: txt })) as {
                items: ARTICLE[]
            }
            setFiltered(data.items)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setFiltered([])
        }
    }, [])

    const getCategories = useCallback(async () => {
        const data = await fetchCategories({ limit: 12 })

        if (!data.categories) return
        setCategories(data.categories)
    }, [])

    useEffect(() => {
        if (search) {
            fetchFiltered(search)
        }
    }, [search, fetchFiltered])

    useEffect(() => {
        if (query) {
            fetchFiltered(query)
        }
    }, [query, fetchFiltered])

    useEffect(() => {
        getCategories()
    }, [getCategories])

    return (
        <div className='grid grid-cols-1 py-12 gap-10 lg:grid-cols-3 lg:py-24'>
            <div className='flex flex-col gap-4 relative w-full col-span-2'>
                <div className='flex items-center gap-4 w-full justify-between mb-4'>
                    <div className='w-full md:w-3/4 lg:w-1/2 p-0'>
                        <Search
                            label='Search articles'
                            placeholder='Search by title or tag ...'
                        />
                    </div>
                    {(query || search) && (
                        <div className='flex items-center my-4 justify-between gap-5 border bg-white rounded-lg py-0 pl-4'>
                            <Text className='text-sm font-bold'>Results</Text>

                            <Button
                                size='icon'
                                variant='secondary'
                                className='border border-gray-200'>
                                {filtered && filtered.length}
                            </Button>
                        </div>
                    )}
                </div>

                {loading && !filtered.length && <ArticleLoader />}

                <div className='grid grid-cols-1 gap-8'>
                    {search || query ? (
                        <Fragment>
                            {filtered &&
                                filtered.map(
                                    (article: ARTICLE, index: number) => (
                                        <Fragment key={article?.id}>
                                            <ArticleCard article={article} />
                                            <hr className='last:hidden border border-gray-100' />
                                        </Fragment>
                                    )
                                )}
                        </Fragment>
                    ) : (
                        <Fragment>
                            {articles &&
                                articles.map((article) => (
                                    <Fragment key={article?.id}>
                                        <ArticleCard article={article} />
                                        <hr className='last:hidden border border-gray-100' />
                                    </Fragment>
                                ))}
                        </Fragment>
                    )}
                </div>

                {!articles.length && !loading ? (
                    <div className='my-8'>
                        <Unavailable
                            message='😧 No published fables found'
                            src='/images/unavailable.svg'
                        />
                    </div>
                ) : null}
                {query && filtered.length === 0 && !loading ? (
                    <div className='my-8'>
                        <Unavailable
                            message='😧 Not blog matched, try another search keyword'
                            src='/images/unavailable.svg'
                        />
                    </div>
                ) : null}
            </div>

            <div className='hidden w-full py-2.5 lg:block '>
                <FilterByCategory categories={categories} query={query} />
            </div>
        </div>
    )
}

export default ArticleList
