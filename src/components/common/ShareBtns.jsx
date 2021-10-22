import React, { useEffect, useState } from 'react'
import { FaWhatsapp, FaTwitter, FaFacebook } from 'react-icons/fa'
import {
    Box,
    Divider,
    Grid,
    Heading,
    HStack,
    IconButton,
    Text,
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
        <Box height='auto' width='100%' mb='1rem'>
            <Heading size='md'>Share with others</Heading>
            <Divider my='1rem' />
            <Grid gap='1rem' templateColumns='repeat(2,1fr)' p='0'>
                {shares.map((share, index) => (
                    <Box
                        key={index}
                        as='a'
                        p='10px'
                        borderRadius='10px'
                        border='1px solid'
                        borderColor={
                            colorMode === 'light' ? '#eee' : 'gray.700'
                        }
                        href={share.href}
                        rel='noopener noreferrer'
                        transition='.3s ease'
                        _hover={{ border: '1px solid #6f0dcc', shadow: 'md' }}
                        target='_blank'>
                        <HStack>
                            <IconButton
                                icon={share.icon}
                                bg='purple.100'
                                color='#6f0dcc'
                                borderRadius='10px'
                            />
                            <Text fontSize='1rem'>{share.label}</Text>
                        </HStack>
                    </Box>
                ))}
            </Grid>
        </Box>
    )
}

export default Share
