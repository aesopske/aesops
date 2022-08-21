import {
    VStack,
    useColorMode,
    HStack,
    Heading,
    // Badge,
    Stack,
    Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import UserAvatar from '../common/UserAvatar'

function DatasetsListItem({ dataset }) {
    const { colorMode } = useColorMode()
    return (
        <VStack
            key={dataset._id}
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            p={['20px', '', '30px']}
            spacing='8'
            alignItems='flex-start'
            justifyContent='space-between'
            borderRadius='10px'>
            <Stack
                justifyContent='space-between'
                width='100%'
                spacing='3'
                direction={['column', 'column', 'row']}>
                <Link href={`/datasets/${dataset.slug}`} passHref>
                    <Heading
                        fontSize={['xl', '', '2xl']}
                        cursor='pointer'
                        textTransform='capitalize'>
                        {dataset.title}
                    </Heading>
                </Link>

                {/* <HStack>
                    <Badge fontWeight='600' p='5px' borderRadius='5px'>
                        # Economy
                    </Badge>
                    <Badge fontWeight='600' p='5px' borderRadius='5px'>
                        # Tech
                    </Badge>
                    <Badge fontWeight='600' p='5px' borderRadius='5px'>
                        # General
                    </Badge>
                </HStack> */}
            </Stack>
            <HStack
                justifyContent='space-between'
                alignItems='flex-end'
                width='100%'>
                <UserAvatar
                    user={{
                        name: dataset?.author,
                        date: new Date(dataset?.created).toDateString(),
                    }}
                />

                <Button
                    as='a'
                    target='_blank'
                    rel='noopener noreferer'
                    href={dataset?.link}
                    fontSize='0.9rem'>
                    Go to link
                </Button>
            </HStack>
        </VStack>
    )
}

DatasetsListItem.defaultProps = {
    app: {},
}

export default DatasetsListItem
