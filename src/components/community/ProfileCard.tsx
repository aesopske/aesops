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
import { APP, ARTICLE, DATASET, USER } from '@/types'

type Details = {
    apps: APP[]
    posts: ARTICLE[]
    datasets: DATASET[]
}

type ProfileCardProps = {
    profile: USER
    details: Details
}

function ProfileCard({ profile, details }: ProfileCardProps) {
    const { colorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const src =
        profile?.photourl && typeof profile?.photourl === 'object'
            ? (profile?.photourl?.url as string)
            : (profile?.photourl as string)

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
                    left='40%'
                    top='20%'
                    transform='translate(-50%,-50%%)'
                />
                <Box
                    mt='1rem'
                    height='auto'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    p='20px 10px'
                    borderRadius='0 0 20px 20px'>
                    <Stack
                        height='100%'
                        direction='column'
                        justifyContent='flex-start'
                        alignItems='center'>
                        <Heading
                            fontSize='xl'
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
                                closeOnClick
                                placement='bottom'>
                                <IconButton
                                    aria-label='Show details'
                                    icon={<BiDetail />}
                                    borderRadius='8px'
                                    height='40px'
                                    onClick={onOpen}
                                    width='20px'
                                    colorScheme='brand'
                                />
                            </Tooltip>
                            <Tooltip
                                label='Contact'
                                hasArrow
                                closeOnClick
                                placement='bottom'>
                                <IconButton
                                    as='a'
                                    aria-label='Contact'
                                    href={`mailto:${profile.email}`}
                                    rel='noopener noreferer'
                                    _active={{ outline: 'none' }}
                                    _focus={{ outline: 'none' }}
                                    target='_blank'
                                    borderRadius='8px'
                                    height='40px'
                                    width='20px'
                                    icon={<FaEnvelope />}
                                    colorScheme='brand'
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
