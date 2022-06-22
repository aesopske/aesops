import React from 'react'
import {
    Box,
    Image,
    Heading,
    Text,
    Stack,
    Button,
    useColorMode,
} from '@chakra-ui/react'
import Link from 'next/link'

function Projects() {
    const { colorMode } = useColorMode()
    return (
        <Box
            height='auto'
            width={['100%', '90%', '80%', '', '75%']}
            mx='auto'
            p={['20px 0', '20px 0', '30px 0', '100px 0']}>
            <Box
                as={Stack}
                height='100%'
                spacing='8'
                direction={[
                    'column-reverse',
                    'column-reverse',
                    'column-reverse',
                    'row',
                ]}
                alignItems='center'
                justifyContent='space-between'
                width={['90%', '90%', '90%', '100%']}
                mx='auto'
                my={['0', '0', '2rem', '4rem']}>
                <Box
                    flex='1'
                    width={['100%', '60%', '40%']}
                    height={['100%', '70%', '60%']}
                    mt={['2rem', '2rem', '2rem', '0']}>
                    <Image
                        bg={colorMode === 'light' ? '#fff' : 'gray.800'}
                        p='30px'
                        borderRadius='10px'
                        src='/svg/projects.svg'
                        alt='projects'
                        width={['100%', '100%', '80%']}
                        height='100%'
                        objectFit='contain'
                    />
                </Box>

                <Box flex='1'>
                    <Heading fontSize={['2xl', '', '', '', '3xl', '4xl']}>
                        Interesting Projects
                    </Heading>
                    <Text
                        as='p'
                        my='2rem'
                        fontSize={['lg', '', '', '', '', 'xl']}
                        color={
                            colorMode === 'light' ? '#555' : 'whiteAlpha.800'
                        }
                        width={['100%', '100%', '90%', '100%']}>
                        Well beyond learning and all things technical, our main
                        goal is to be interesting and informative. We therefore
                        try to find information that adds value to our readers,
                        that informs, challenges and develops everyone that
                        reads them with their quality and intensive research.
                    </Text>
                    <Link href='/apps' passHref>
                        <Button
                            height={['2.5rem', '2.5rem', '2.5rem', '3rem']}
                            width={['100%', '100%', '90%', 'auto']}
                            borderRadius='10px'
                            fontSize='1rem'
                            bg='brand.primary'
                            _hover={{ bg: 'brand.hover' }}
                            _focus={{ bg: 'brand.hover', outline: 'none' }}
                            _active={{ bg: 'brand.hover', outline: 'none' }}
                            color='#fff'
                            fontWeight='500'>
                            View applications &rarr;
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}

export default Projects
