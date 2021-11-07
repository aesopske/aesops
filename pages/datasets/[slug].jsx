import Layout from '@/src/components/common/Layout'
import { fetchDataset } from '@/src/utils/requests'
import {
    Box,
    Stack,
    useColorMode,
    Heading,
    Grid,
    GridItem,
    Divider,
    HStack,
    Icon,
    Text,
    Button,
} from '@chakra-ui/react'
import UserAvatar from '@/src/components/common/UserAvatar'
import MarkdownReader from '@/src/components/common/MarkdownReader'
import Link from 'next/link'
import { RiArticleLine } from 'react-icons/ri'
import { useState, useEffect } from 'react'
import { DiscussionEmbed } from 'disqus-react'
import slugify from 'slugify'

function DatasetDetail({ dataset }) {
    const { colorMode } = useColorMode()
    const [config, setConfig] = useState({})

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setConfig({
                url: window.location.href,
                identifier: dataset._id,
                title: dataset.title,
            })
        }
    }, [dataset.body, dataset._id, dataset.title])

    const articleSlug = slugify(dataset.article)
    return (
        <Layout>
            <Box width='80%' mx='auto' height='auto' minHeight='50vh'>
                <Box
                    height='30vh'
                    my='1rem'
                    borderRadius='10px'
                    bgImage={
                        colorMode === 'light'
                            ? 'url(/images/background.png)'
                            : 'url(/svg/hero-dark.svg)'
                    }
                    bgSize='cover'
                    position='relative'
                    bgRepeat='no-repeat'>
                    <Box
                        as={Stack}
                        position='absolute'
                        height='100%'
                        width='100%'
                        top='0'
                        left='0'
                        p='0 60px'
                        direction='column'
                        alignItems='flex-start'
                        justifyContent='center'
                        borderRadius='10px'
                        color='#fff'
                        spacing='6'>
                        <Heading>{dataset.title}</Heading>
                        <UserAvatar
                            user={{
                                name: dataset.author,
                                date: new Date(dataset.created).toDateString(),
                            }}
                        />
                    </Box>
                </Box>
                <Grid my='2rem' gap='2rem' templateColumns='repeat(3, 1fr)'>
                    <GridItem colSpan='1'>
                        <Box
                            height='20vh'
                            borderRadius='10px'
                            p='20px'
                            bg={colorMode === 'light' ? '#fff' : 'gray.700'}>
                            <HStack>
                                <Icon as={RiArticleLine} fontSize='1.2rem' />
                                <Link
                                    href={`/articles/${articleSlug}`}
                                    passHref>
                                    <Text cursor='pointer'>
                                        {dataset.article} 🔗
                                    </Text>
                                </Link>
                            </HStack>

                            <Divider my='1rem' />

                            <Button
                                as='a'
                                href={dataset.link}
                                my='1rem'
                                fontSize='0.9rem'
                                height='3rem'
                                bg='brand.primary'
                                _hover={{ bg: 'brand.hover' }}
                                _focus={{ bg: 'brand.hover', outline: 'none' }}
                                color='#fff'
                                _active={{
                                    bg: 'brand.hover',
                                    outline: 'none',
                                }}>
                                Go to dataset &rarr;
                            </Button>
                        </Box>
                    </GridItem>
                    <GridItem colSpan='2'>
                        <Box>
                            <Heading size='md'>Description</Heading>
                            <Divider my='1rem' />
                            <MarkdownReader content={dataset.description} />
                            <Box mt='2rem'>
                                <DiscussionEmbed
                                    shortname='aesops'
                                    config={config}
                                />
                            </Box>
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
        </Layout>
    )
}

export async function getServerSideProps(ctx) {
    const { slug } = ctx.params
    const data = await fetchDataset(slug)

    if (!data) {
        return {
            redirect: {
                destination: '/datasets',
                persistant: false,
            },
        }
    }

    return {
        props: {
            dataset: data.item,
        },
    }
}

DatasetDetail.defaultProps = {
    dataset: {},
}

export default DatasetDetail
