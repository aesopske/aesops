import { Text, Grid } from '@chakra-ui/react'
import FeaturedCard from './FeaturedCard'

function FeaturedList({ featured }) {
    return (
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
            {/* {!featured.length &&
                loading &&
                ft.map((index) => <FeaturedLazy key={index} />)} */}

            {featured &&
                featured.map((article) => (
                    <FeaturedCard key={article._id} article={article} />
                ))}
            {!featured && <Text>Articles not available</Text>}
        </Grid>
    )
}

export default FeaturedList
