import React from 'react'
import Image from 'next/image'
import Text from './atoms/Text'

type UnavailableProps = {
    message: string
    src: string
}

function Unavailable({ message, src }: UnavailableProps) {
    return (
        <div className='w-full h-full relative bg-brand-background flex flex-col gap-4 items-center justify-center text-center'>
            <Image
                src={src}
                width={300}
                height={300}
                className='w-48 h-48'
                alt='Unavailable'
            />
            <Text className='text-center'>{message}</Text>
        </div>
    )
}

export default Unavailable
