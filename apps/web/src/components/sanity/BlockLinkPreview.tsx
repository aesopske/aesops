'use client'

import type { PreviewProps } from 'sanity'
import { Flex } from '@sanity/ui'

function BlockLinkPreview(props: PreviewProps) {
    return (
        <Flex align='center' justify='space-between' padding={2} width={'100%'}>
            <div className='w-full'>{props.renderDefault(props)}</div>
        </Flex>
    )
}
export default BlockLinkPreview
