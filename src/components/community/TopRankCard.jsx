import React from 'react'
import {
    Box,
    Heading,
    Avatar,
    Text,
    AvatarBadge,
    Icon,
    Stack,
    useColorMode,
    // useDisclosure,
    Button,
} from '@chakra-ui/react'
import { FaCrown } from 'react-icons/fa'
// import ProfileModal from '../ProfileModal'

function TopRankCard({ profile }) {
    // const { isOpen, onClose, onOpen } = useDisclosure()
    const { colorMode } = useColorMode()

    const src =
        profile?.photourl && typeof profile?.photourl === 'object'
            ? profile?.photourl.url
            : profile?.photourl

    return (
        <>
            {/* {isOpen && (
                <ProfileModal
                    user={profile}
                    isOpen={isOpen}
                    onClose={onClose}
                    featured
                />
            )} */}
            <Box
                borderRadius='20px'
                shadow='xl'
                height='auto'
                className={
                    colorMode === 'light' ? 'glass-effect' : 'glass-effect-dark'
                }
                position='relative'
                minHeight='20vh'>
                <Box height='10vh' bg='transparent' />

                <Avatar
                    name={profile?.name}
                    src={src}
                    size='2xl'
                    position='absolute'
                    bg={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                    left='50%'
                    top='10%'
                    transform='translate(-50%,-10%)'>
                    <AvatarBadge boxSize='1.25em' bg='orange.300'>
                        <Icon as={FaCrown} fontSize='1.2rem' color='#fff' />
                    </AvatarBadge>
                </Avatar>
                <Box
                    height='auto'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    p='20px'
                    borderRadius='0 0 20px 20px'>
                    <Box
                        mt='4rem'
                        as={Stack}
                        height='100%'
                        direction='column'
                        justifyContent='flex-start'
                        alignItems='center'>
                        <Heading
                            fontSize='1.5rem'
                            textAlign='center'
                            textTransform='capitalize'>
                            {profile?.name}
                        </Heading>
                        <Text
                            as='p'
                            textAlign='center'
                            color={colorMode === 'light' ? '#555' : 'gray.300'}>
                            {profile?.email}
                        </Text>
                        <Text
                            as='p'
                            mt='.5rem'
                            mb='2rem'
                            textAlign='center'
                            textTransform='capitalize'
                            color={colorMode === 'light' ? '#555' : 'gray.400'}>
                            {profile?.occupation}
                        </Text>

                        <Button
                            my='1rem'
                            fontSize='.9rem'
                            fontWeight='500'
                            colorScheme='gray'
                            // onClick={onOpen}
                            _focus={{ outline: 'none' }}>
                            More details
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default TopRankCard
