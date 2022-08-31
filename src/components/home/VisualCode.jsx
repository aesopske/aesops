import React from 'react'
import { Box, Image, Heading, Text, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import AesopBtn from '../common/atoms/AesopBtn'

function VisualCode() {
    return (
        <Box
            height='auto'
            width='100%'
            mx='auto'
            p={['50px 20px', '50px 0', '50px 0']}
            bgImage="url('/images/project.jpg')"
            bgAttachment='fixed'
            bgSize='cover'
            borderRadius='0'
            bgRepeat='no-repeat'
            position='relative'
            my='2rem'>
            <Box
                bgGradient='linear(to-r,#804fadcc, #700dccc0 )'
                position='absolute'
                borderRadius='0'
                top='0'
                left='0'
                zIndex='0'
                width='100%'
                height='100%'
            />
            <Box
                as={Stack}
                height='100%'
                direction={['column', 'column', 'column', 'row']}
                alignItems='center'
                justifyContent='space-between'
                width={['100%', '90%', '80%', '', '75%']}
                mx='auto'
                spacing='8'
                my={['0', '0', '2rem', '4rem']}>
                <Box flex='1' color='#fff' zIndex='20'>
                    <Heading fontSize={['2xl', '', '', '', '3xl', '4xl']}>
                        Visuals and Code
                    </Heading>
                    <Text
                        as='p'
                        my='2rem'
                        fontSize={['lg', '', '', '', '', 'xl']}
                        width={['100%', '100%', '90%', '100%']}>
                        Our eyes are the gateways to our very souls. We appeal
                        to the souls of our readers with beautiful plots made in
                        R, python or tableau that will captivate, inform and
                        mostly delight each and every person that sees them. We
                        then share the code that was used to make the graphs and
                        analysis so that we encourage collaboration,
                        verification and duplication of the work to maintain
                        high professionalism and encourage learning.
                    </Text>
                    <Link href='/apps' passHref>
                        {/* <Button
                            height={['2.5rem', '2.5rem', '2.5rem', '3rem']}
                            width={['100%', '100%', '90%', 'auto']}
                            borderRadius='10px'
                            fontSize='1rem'
                            bg='#fff'
                            colorScheme='gray'
                            mb={['2rem', '0']}
                            color='#444'
                            fontWeight='500'>
                            View applications &rarr;
                        </Button> */}
                        <AesopBtn
                            label='View datasets &rarr;'
                            bg='white'
                            color='gray.600'
                            minWidth={['100%', '100%', '90%', '40%']}
                            _hover={{ bg: 'gray.100' }}
                            _focus={{ bg: 'gray.100' }}
                            _active={{ bg: 'gray.100' }}
                        />
                    </Link>
                </Box>
                <Box
                    flex='1'
                    as={Stack}
                    display={['none', 'none', 'flex']}
                    zIndex='20'
                    alignItems='flex-end'
                    width={['100%', '60%', '40%']}
                    height={['100%', '70%', '60%']}>
                    <Image
                        src='/svg/visuals.svg'
                        alt='visuals'
                        width={['', '', '', '80%']}
                        height='100%'
                        objectFit='contain'
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default VisualCode
