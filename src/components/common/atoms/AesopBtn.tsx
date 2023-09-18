import React from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'

interface AesopBtnProps extends ButtonProps {
    label: string
    isLink: boolean
    href: string
    target: string
    rel: string
}

function AesopBtn({
    label,
    variant,
    size,
    type,
    isLink,
    ...props
}: AesopBtnProps) {
    return (
        <Button
            type={type}
            {...props}
            size={size}
            width='auto'
            height='3rem'
            cursor={isLink ? 'pointer' : 'default'}
            fontSize={size}
            borderRadius='xl'
            variant={variant}
            colorScheme='brand'
            fontFamily='Roboto'>
            {label}
        </Button>
    )
}

export default AesopBtn
