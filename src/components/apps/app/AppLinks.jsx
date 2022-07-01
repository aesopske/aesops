import {
    Box,
    useColorMode,
    Divider,
    HStack,
    Icon,
    Text,
    Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import { RiArticleLine, RiDatabase2Line } from 'react-icons/ri'
import slugify from 'slugify'

function AppLinks({ app }) {
    const { colorMode } = useColorMode()
    const appSlug = slugify(app?.article, { lower: true })
    const datasetSlug = slugify(app?.dataset, { lower: true })

    return (
        <Box
            height='auto'
            minHeight='20vh'
            borderRadius='10px'
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}>
            <HStack alignItems='center'>
                <Icon as={RiArticleLine} fontSize='lg' />
                {app?.article ? (
                    <Link href={`/articles/${appSlug}`} passHref>
                        <Text
                            cursor='pointer'
                            fontSize='lg'
                            _hover={{
                                color:
                                    colorMode === 'light'
                                        ? 'brand.hover'
                                        : 'brand.muted',
                            }}>
                            {app?.article} &rarr;
                        </Text>
                    </Link>
                ) : (
                    <Text cursor='pointer' fontSize='lg'>
                        No linked fables
                    </Text>
                )}
            </HStack>
            <HStack my='1rem' alignItems='center'>
                <Icon as={RiDatabase2Line} fontSize='lg' />
                {app?.dataset ? (
                    <Link href={`/datasets/${datasetSlug}`} passHref>
                        <Text
                            cursor='pointer'
                            fontSize='lg'
                            _hover={{
                                color:
                                    colorMode === 'light'
                                        ? 'brand.hover'
                                        : 'brand.muted',
                            }}>
                            {app?.dataset} &rarr;
                        </Text>
                    </Link>
                ) : (
                    <Text cursor='pointer' fontSize='lg'>
                        No linked dataset
                    </Text>
                )}
            </HStack>

            <Divider my='1rem' />

            <Button
                as='a'
                href={app?.link}
                my='1rem'
                target='_blank'
                rel='noopener noreferer'
                fontSize='lg'
                height='3rem'
                bg={colorMode === 'light' ? 'brand.primary' : 'brand.muted'}
                _hover={{ bg: 'brand.hover' }}
                _focus={{
                    bg: colorMode === 'light' ? 'brand.primary' : 'brand.muted',
                }}
                color='#fff'
                _active={{
                    bg: colorMode === 'light' ? 'brand.primary' : 'brand.muted',
                }}>
                Go to application
            </Button>
        </Box>
    )
}

AppLinks.defaultProps = {
    app: {},
}

export default AppLinks
