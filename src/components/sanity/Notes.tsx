import { Notebook } from 'lucide-react'
import React from 'react'

import Heading from '@components/common/atoms/Heading'

import Text from '../common/atoms/Text'

function Notes() {
    return (
        <div className='rounded-lg bg-teal-200 p-6 space-y-3'>
            <Heading type='h3' className='flex items-center gap-1 font-bold'>
                <Notebook /> Notes
            </Heading>
            <Text className='text-base italic'>
                This is a list of notes that I have taken while working on this
                project. I will be adding more notes as I go along.
            </Text>
        </div>
    )
}

export default Notes
