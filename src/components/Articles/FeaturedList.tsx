import {
    Grid,
    Box,
    Heading,
    useMediaQuery,
    useColorMode,
} from '@chakra-ui/react'

import { ARTICLE } from '@/types'
import FeaturedCard from './FeaturedCard'
import Overflow from '../common/Overflow'

type FeaturedListProps = {
    featured: ARTICLE[]
}

function FeaturedList({ featured }: FeaturedListProps) {
    const { colorMode } = useColorMode()
    const [isTabletAndUp] = useMediaQuery('(min-width: 1024px)')
    return (
        <Box>
            <Heading fontSize={['2xl', '', '', '', '2xl']} my='2rem'>
                Editor&apos;s Choice
            </Heading>
            {isTabletAndUp ? (
                <Grid
                    gap='1rem 2rem'
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
                <Overflow
                    color={colorMode === 'light' ? 'gray.700' : 'gray.400'}>
                    {featured &&
                        featured.map((article) => (
                            <FeaturedCard
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
