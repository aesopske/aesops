import { Button } from '@chakra-ui/react'
import React from 'react'

function AesopBtn({ label, variant, size, type, isLink, ...props }) {
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
