'use client'

import { PreviewProps } from 'sanity'
import React from 'react'
import Text from '@components/common/atoms/Text'

type NotesProps = {
    note: string
    title: string
} & PreviewProps

function Notes(props: NotesProps) {
    let { note } = props

    return (
        <div className='rounded-lg p-2 space-y-2'>
            {props.renderDefault(props)}

            <Text className='text-sm dark:text-gray-400 text-gray-700'>
                {note}
            </Text>
        </div>
    )
}

export default Notes
