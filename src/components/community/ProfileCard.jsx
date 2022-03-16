import React from 'react'
import {
    Box,
    Heading,
    Text,
    IconButton,
    Tooltip,
    HStack,
    Avatar,
    Stack,
    useColorMode,
    useDisclosure,
} from '@chakra-ui/react'
import { FaEnvelope } from 'react-icons/fa'
import { BiDetail } from 'react-icons/bi'
import ProfileDetails from './ProfileDetails'

function ProfileCard({ profile = {}, details = {} }) {
    const { colorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const src =
        profile?.photourl && typeof profile?.photourl === 'object'
            ? profile?.photourl.url
            : profile?.photourl

    return (
        <React.Fragment>
            <ProfileDetails
                isOpen={isOpen}
                onClose={onClose}
                profile={profile}
                details={details}
            />
            <Box
                borderRadius='20px'
                border='1px solid'
                borderColor={colorMode === 'light' ? '#eee' : 'gray.700'}
                height='auto'
                bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                position='relative'
                minHeight='20vh'>
                <Box
                    height='10vh'
                    bgImage={
                        colorMode === 'light'
                            ? '/images/background.png'
                            : '/svg/hero-dark.svg'
                    }
                    bgSize='cover'
                    bgRepeat='no-repeat'
                    bgPosition='center'
                    borderRadius='20px 20px 0 0'
                />

                <Avatar
                    name={profile?.name}
                    src={src}
                    size='lg'
                    position='absolute'
                    borderRadius='20px'
                    left='50%'
                    top={['15%', '15%', '15%', '15%', '15%', '22%']}
                    transform='translate(-50%,-15%)'
                />
                <Box
                    height='auto'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    p='20px 10px'
                    borderRadius='0 0 20px 20px'>
                    <Stack
                        mt='1rem'
                        height='100%'
                        direction='column'
                        justifyContent='flex-start'
                        alignItems='center'>
                        <Heading
                            my='1rem'
                            fontSize='lg'
                            textAlign='center'
                            textTransform='capitalize'>
                            {profile?.name}
                        </Heading>

                        <Text
                            as='p'
                            mb='1rem'
                            textAlign='center'
                            textTransform='capitalize'
                            color={colorMode === 'light' ? '#555' : 'gray.300'}>
                            {profile?.occupation}
                        </Text>

                        <HStack>
                            <Tooltip
                                label='Show details'
                                hasArrow
                                placement='bottom'>
                                <IconButton
                                    icon={<BiDetail />}
                                    borderRadius='8px'
                                    height='40px'
                                    onClick={onOpen}
                                    width='20px'
                                    bg={
                                        colorMode === 'light'
                                            ? 'purple.100'
                                            : 'gray.600'
                                    }
                                    color={
                                        colorMode === 'light'
                                            ? 'brand.primary'
                                            : 'brand.muted'
                                    }
                                />
                            </Tooltip>
                            <Tooltip
                                label='Contact'
                                hasArrow
                                placement='bottom'>
                                <IconButton
                                    as='a'
                                    href={`mailto:${profile.email}`}
                                    rel='noopener noreferer'
                                    target='_blank'
                                    borderRadius='8px'
                                    height='40px'
                                    width='20px'
                                    bg={
                                        colorMode === 'light'
                                            ? 'purple.100'
                                            : 'gray.600'
                                    }
                                    color={
                                        colorMode === 'light'
                                            ? 'brand.primary'
                                            : 'brand.muted'
                                    }
                                    icon={<FaEnvelope />}
                                />
                            </Tooltip>
                        </HStack>
                    </Stack>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default ProfileCard
