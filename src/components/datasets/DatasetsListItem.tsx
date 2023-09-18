import Link from 'next/link'
import { VStack, useColorMode, HStack, Heading, Stack } from '@chakra-ui/react'

import { DATASET } from '@/types'
import UserAvatar from '../common/UserAvatar'
import AesopBtn from '../common/atoms/AesopBtn'

type DatasetsListItemProps = {
    dataset: DATASET
}

function DatasetsListItem({ dataset }: DatasetsListItemProps) {
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

                <AesopBtn
                    label='Visit Link'
                    as='a'
                    isLink
                    target='_blank'
                    rel='noopener noreferer'
                    href={dataset?.link}
                />
            </HStack>
        </VStack>
    )
}

DatasetsListItem.defaultProps = {
    app: {},
}

export default DatasetsListItem
