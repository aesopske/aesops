'use client'

import { StickyNote } from 'lucide-react'
import React from 'react'
import { PreviewProps } from 'sanity'

import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'

function Notes(props: PreviewProps) {
    let { note } = props as any

    return (
        <div className='rounded-lg p-2 space-y-6'>
            <Heading type='h3' className='flex items-center gap-2 font-bold'>
                <StickyNote className='h-7 w-7' />
                Note
            </Heading>
            <Text className='dark:text-gray-400 text-gray-700'>{note}</Text>
        </div>
    )
}

export default Notes
