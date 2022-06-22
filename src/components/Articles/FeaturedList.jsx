import { Grid, Box, Heading, useMediaQuery } from '@chakra-ui/react'
import FeaturedCard from './FeaturedCard'
import Overflow from '../common/Overflow'

function FeaturedList({ featured }) {
    const [isTabletAndUp] = useMediaQuery('(min-width: 768px)')
    return (
        <Box>
            <Heading fontSize={['2xl', '', '', '', '4xl']} my='2rem'>
                Editor&apos;s Choice
            </Heading>
            {isTabletAndUp ? (
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
                            <FeaturedCard
                                key={article?._id}
                                article={article}
                            />
                        ))}
                </Grid>
            ) : (
                <Overflow>
                    {featured &&
                        featured.map((article) => (
                            <FeaturedCard
                                isMobile
                                key={article?._id}
                                article={article}
                            />
                        ))}
                </Overflow>
            )}
        </Box>
    )
}

export default FeaturedList
