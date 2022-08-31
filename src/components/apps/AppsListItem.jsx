import {
    VStack,
    useColorMode,
    HStack,
    Heading,
    // Badge,
    Stack,
} from '@chakra-ui/react'
import Link from 'next/link'
import AesopBtn from '../common/atoms/AesopBtn'
import UserAvatar from '../common/UserAvatar'

function AppsListItem({ app }) {
    const { colorMode } = useColorMode()
    return (
        <VStack
            key={app._id}
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
                direction={['column', 'column', 'column', 'row']}>
                <Link href={`/apps/${app.slug}`} passHref>
                    <Heading
                        fontSize={['xl', '', '2xl']}
                        textTransform='capitalize'
                        cursor='pointer'>
                        {app.title}
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
                        name: app.author,
                        date: new Date(app.created).toDateString(),
                    }}
                />
                <AesopBtn
                    label='Visit Link'
                    as='a'
                    isLink
                    target='_blank'
                    rel='noopener noreferer'
                    href={app?.link}
                />
            </HStack>
        </VStack>
    )
}

AppsListItem.defaultProps = {
    app: {},
}

export default AppsListItem
