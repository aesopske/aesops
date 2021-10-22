import React from 'react'
// import ProfileModal from '../ProfileModal'
import {
    Box,
    Heading,
    Text,
    Button,
    Avatar,
    Stack,
    useColorMode,
    // useDisclosure,
} from '@chakra-ui/react'

function ProfileCard({ profile }) {
    // const { isOpen, onClose, onOpen } = useDisclosure()
    const { colorMode } = useColorMode()

    const src =
        profile?.photourl && typeof profile?.photourl === 'object'
            ? profile?.photourl.url
            : profile?.photourl

    return (
        <React.Fragment>
            {/* {isOpen && (
                <ProfileModal
                    user={profile}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            )} */}

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
                    left='50%'
                    top={['15%', '15%', '15%', '15%', '25%']}
                    transform='translate(-50%,-15%)'
                />
                <Box
                    height='auto'
                    bg={colorMode === 'light' ? '#fff' : 'gray.700'}
                    p='20px 10px'
                    borderRadius='0 0 20px 20px'>
                    <Box
                        mt='1rem'
                        as={Stack}
                        height='100%'
                        direction='column'
                        justifyContent='flex-start'
                        alignItems='center'>
                        <Heading
                            my='0.5rem'
                            fontSize='1.2rem'
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
                            mt='0.5rem'
                            mb='2rem'
                            textAlign='center'
                            textTransform='capitalize'
                            color={colorMode === 'light' ? '#555' : 'gray.300'}>
                            {profile?.occupation}
                        </Text>

                        <Button
                            mt='1rem'
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
        </React.Fragment>
    )
}

export default ProfileCard
