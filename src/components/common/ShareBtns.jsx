import React, { useEffect, useState } from 'react'
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa'
import {
    Box,
    Divider,
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
        <Box
            height='auto'
            width='100%'
            bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
            p='25px'
            borderRadius='10px'>
            <Heading fontSize={['lg', '', '', '', 'xl']}>
                Share with others
            </Heading>

            <Divider my='0.5rem' />

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
                        color='purple'
                        fontSize='xl'
                    />
                ))}
            </HStack>
        </Box>
    )
}

export default Share
