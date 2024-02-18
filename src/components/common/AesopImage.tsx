import React from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface AesopsImageProps extends ImageProps {
    width: number | undefined
    height: number | undefined
}

function AesopImage({
    src,
    alt,
    width,
    height,
    className,
    ...props
}: AesopsImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={width !== undefined ? `${Math.round(width)}px` : '100vw'}
            className={cn('cover w-full h-full aspect-auto', className)}
            {...props}
        />
    )
}

export default AesopImage
