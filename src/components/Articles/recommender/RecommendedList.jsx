import React, { useEffect, useState } from 'react'
import {
    Box,
    Center,
    Divider,
    Grid,
    Heading,
    Text,
    useColorMode,
} from '@chakra-ui/react'
import RecommendedListItem from './RecommendedListItem'
import { fetchRecommended } from '@/src/utils/requests'
import Link from 'next/link'

function RecommendedList({ title }) {
    const [recommended, setRecommended] = useState([])
    const { colorMode } = useColorMode()

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
        <Box
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            width='100%'
            p='10px'
            borderRadius='10px'>
            <Heading fontSize='md'>Recommended articles</Heading>
            <Divider my='0.5rem' />
            <Grid gap='1rem' templateColumns='repeat(1,1fr)'>
                {recommended &&
                    recommended.map((item) => (
                        <RecommendedListItem key={item._id} item={item} />
                    ))}
            </Grid>
            {!recommended.length && (
                <Center flexDirection='column' height='100%'>
                    <Text fontSize='sm' fontWeight='400'>
                        😧
                    </Text>
                    <Text fontSize='sm' textAlign='center'>
                        We couldn&apos;t find any recommended fables.
                    </Text>
                    <Link href='/fables' passHref>
                        <Text
                            fontSize='sm'
                            cursor='pointer'
                            textAlign='center'
                            color={
                                colorMode === 'light'
                                    ? 'brand.primary'
                                    : 'brand.muted'
                            }>
                            Continue Exploring &rarr;
                        </Text>
                    </Link>
                </Center>
            )}
        </Box>
    )
}

RecommendedList.defaultProps = {
    title: '',
}

export default RecommendedList
