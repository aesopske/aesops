import { StickyNote } from 'lucide-react'
import React from 'react'
import ContentReader from '@apps/web/src/components/common/ContentReader'
import Heading from '@apps/web/src/components/common/atoms/Heading'

function PostNote({ content }) {
    return (
        <div className='rounded-lg p-6 space-y-6 bg-brandprimary-50 text-brandprimary-800'>
            <Heading type='h3' className='flex items-center gap-2 font-bold'>
                <StickyNote className='h-7 w-7' />
                {content?.noteTitle || 'Note'}
            </Heading>
            <div className='space-y-4'>
                <ContentReader content={content?.note} />
            </div>
        </div>
    )
}

export default PostNote
