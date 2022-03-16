import React, { useEffect, useState } from 'react'
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa'
import {
    Box,
    Heading,
    HStack,
    IconButton,
    useColorMode,
} from '@chakra-ui/react'

function Share({ title }) {
    const { colorMode } = useColorMode()
    const [newUrl, setnewUrl] = useState(null)

    useEffect(() => {
        if (typeof window !== undefined) {
            const url = window.location.href
            const encoded = encodeURIComponent(url)
            setnewUrl(encoded)
        }
    }, [])

    const shares = [
        {
            href: `https://www.facebook.com/sharer/sharer.php?u=${newUrl}&quote=${title}&display=page&caption=${title}`,
            icon: <FaFacebook />,
            label: 'Facebook',
        },
        {
            href: `http://twitter.com/share?url=${newUrl}\n&text=${title}&hashtags=aesopske&via=Aesopsk`,
            icon: <FaTwitter />,
            label: 'Twitter',
        },
        {
            href: `whatsapp://send?text=${newUrl} ${title}`,
            icon: <FaWhatsapp />,
            label: 'Whatsapp',
        },
    ]

    return (
        <Box height='auto' width='100%'>
            <Heading fontSize='md'>Share with others</Heading>
            <HStack spacing='3' my='1rem'>
                {shares.map((share) => (
                    <IconButton
                        as='a'
                        key={share.label}
                        borderRadius='10px'
                        target='_blank'
                        border='1px solid'
                        borderColor={
                            colorMode === 'light' ? 'transparent' : 'gray.700'
                        }
                        _hover={{
                            borderColor: 'brand.primary',
                        }}
                        href={share.href}
                        rel='noopener noreferrer'
                        transition='.3s ease'
                        icon={share.icon}
                        bg='purple.100'
                        color='brand.primary'
                    />
                ))}
            </HStack>
        </Box>
    )
}

export default Share
