import { Box, Grid } from '@chakra-ui/react'
import { useState } from 'react'
import Search from '../common/Search'
import ArticleCard from './ArticleCard'

function ArticleList({ articles }) {
    const [searchterm, setSearchterm] = useState('')

    const filteredArticles = articles
        ? articles.filter((article) => {
              return (
                  article.title
                      .toLowerCase()
                      .indexOf(searchterm.toLowerCase()) !== -1
              )
          })
        : []

    return (
        <Box height='auto' minHeight='70vh' my='2rem'>
            <Box my='3rem'>
                <Search
                    placeholder='Search by title or tag ...'
                    setTerm={setSearchterm}
                    term={searchterm}
                    label='Search Posts'
                />
            </Box>

            <Grid
                gap='1rem'
                templateColumns={[
                    'repeat(1, 1fr)',
                    'repeat(1, 1fr)',
                    'repeat(1, 1fr)',
                    'repeat(2, 1fr)',
                    'repeat(2, 1fr)',
                ]}>
                {filteredArticles &&
                    filteredArticles.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
            </Grid>
        </Box>
    )
}

export default ArticleList
