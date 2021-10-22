import { Box, Input, Grid } from '@chakra-ui/react'
import { useState } from 'react'
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
                <Input
                    type='text'
                    value={searchterm}
                    onChange={(e) => setSearchterm(e.target.value)}
                    height='3.5rem'
                    width={['100%', '100%', '90%', '40%', '40%']}
                    placeholder='Search by title ...'
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
