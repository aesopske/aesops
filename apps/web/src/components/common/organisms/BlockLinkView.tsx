import React from 'react'
import { MIN_POST } from '~sanity/utils/types'
import SmallPostCard from './posts/SmallPostCard'

interface BlockLinkProps {
    content: MIN_POST
}

function BlockLinkView({ content }: BlockLinkProps) {
    if (content.isPost) {
        return (
            <div className='max-w-lg my-4'>
                <SmallPostCard post={content} />
            </div>
        )
    }
}

export default BlockLinkView
