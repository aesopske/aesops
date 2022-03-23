import { Grid, Box, Heading } from '@chakra-ui/react'
import FeaturedCard from './FeaturedCard'

function FeaturedList({ featured }) {
    return (
        <Box>
            <Heading fontSize='xl' my='2rem'>
                Editor&apos;s Choice
            </Heading>
            <Grid
                gap='1rem'
                mb='2rem'
                templateColumns={[
                    'repeat(1, 1fr)',
                    'repeat(1, 1fr)',
                    'repeat(2, 1fr)',
                    'repeat(3, 1fr)',
                    'repeat(3, 1fr)',
                ]}>
                {featured &&
                    featured.map((article) => (
                        <FeaturedCard key={article?._id} article={article} />
                    ))}
            </Grid>
        </Box>
    )
}

export default FeaturedList
