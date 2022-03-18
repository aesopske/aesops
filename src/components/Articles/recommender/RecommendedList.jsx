import React, { useEffect, useState } from 'react'
import { Box, Grid, Heading } from '@chakra-ui/react'
import RecommendedListItem from './RecommendedListItem'
import { fetchRecommended } from '@/src/utils/requests'

function RecommendedList({ title }) {
    const [recommended, setRecommended] = useState([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (title) {
                const fetchAll = async () => {
                    try {
                        const recommendations = await fetchRecommended(title)
                        setRecommended(recommendations.items)
                    } catch (error) {
                        setRecommended([])
                    }
                }
                fetchAll()
            }
        }
    }, [title])
    return (
        <Box my='2rem'>
            <Heading fontSize='md'>Recommended articles</Heading>
            <Grid gap='0' templateColumns='repeat(1,1fr)' my='1rem'>
                {recommended &&
                    recommended.map((item) => (
                        <RecommendedListItem key={item._id} item={item} />
                    ))}
            </Grid>
            {!recommended.length && (
                <Heading fontSize='sm' fontWeight='400'>
                    😧 No recommended articles
                </Heading>
            )}
        </Box>
    )
}

RecommendedList.defaultProps = {
    title: '',
}

export default RecommendedList
