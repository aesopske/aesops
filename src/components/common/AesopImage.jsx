import React from 'react'
import Image from 'next/image'
import { chakra } from '@chakra-ui/react'

const CustomImage = chakra(Image, {
    shouldForwardProp: (prop) =>
        [
            'src',
            'alt',
            'objectFit',
            'objectPosition',
            'width',
            'height',
            'sizes',
            'priority',
            'placeholder',
            'blurDataURL',
            'padding',
        ].includes(prop),
})

function AesopImage({ src, alt, width, height, ...props }) {
    return (
        <CustomImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={width !== undefined ? `${Math.round(width)}px` : '100vw'}
            {...props}
        />
    )
}

export default AesopImage
