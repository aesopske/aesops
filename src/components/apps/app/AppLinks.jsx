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
            <HStack>
                <Icon as={RiArticleLine} fontSize='1.3rem' />
                {app?.article ? (
                    <Link href={`/articles/${appSlug}`} passHref>
                        <Text cursor='pointer'>{app?.article} 🔗</Text>
                    </Link>
                ) : (
                    <Text cursor='pointer'>No linked fables</Text>
                )}
            </HStack>
            <HStack my='1rem'>
                <Icon as={RiDatabase2Line} fontSize='1.3rem' />
                {app?.dataset ? (
                    <Link href={`/datasets/${datasetSlug}`} passHref>
                        <Text cursor='pointer'>{app?.dataset} 🔗</Text>
                    </Link>
                ) : (
                    <Text cursor='pointer'>No linked dataset</Text>
                )}
            </HStack>

            <Divider my='1rem' />

            <Button
                as='a'
                href={app?.link}
                my='1rem'
                target='_blank'
                rel='noopener noreferer'
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
                Go to application &rarr;
            </Button>
        </Box>
    )
}

AppLinks.defaultProps = {
    app: {},
}

export default AppLinks
