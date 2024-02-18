import React from 'react'
import Image from 'next/image'

import { urlFor } from '@/utils'
import { getImageDimensions } from '@sanity/asset-utils'

function SanityImage({ value, isInline }) {
    const { width, height } = getImageDimensions(value)
    const url = urlFor(value).width(600).url()
    const blurDataURL = urlFor(value).width(24).height(24).blur(10).url()
    return (
        <Image
            src={url}
            width={width}
            height={height}
            alt={value.alt}
            placeholder='blur'
            blurDataURL={blurDataURL}
            sizes={width !== undefined ? `${Math.round(width)}px` : '100vw'}
            style={{
                display: isInline ? 'inline-block' : 'block',
                aspectRatio: width/ height,
            }}
        />
    )
}
export default SanityImage
