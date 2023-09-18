import Link from 'next/link'
import { VStack, useColorMode, HStack, Heading, Stack } from '@chakra-ui/react'

import { APP } from '@/types'
import UserAvatar from '../common/UserAvatar'
import AesopBtn from '../common/atoms/AesopBtn'

type AppsListItemProps = {
    app: APP
}

function AppsListItem({ app }: AppsListItemProps) {
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
