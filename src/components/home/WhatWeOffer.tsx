import React from 'react'
import {
    Text,
    Box,
    Heading,
    IconButton,
    Grid,
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react'
import { FaDatabase, FaFileAlt, FaShareAlt, FaCode } from 'react-icons/fa'
import Overflow from '../common/Overflow'
import { motion } from 'framer-motion'

function WhatWeOffer() {
    const { colorMode } = useColorMode()
    const [isTabletAndUp] = useMediaQuery('(min-width: 1024px)')
    const activities = [
        {
            name: 'Collect',
            description:
                'Extract data,clean and transform it and finally prepare it to be used by you ',
            icon: <FaDatabase />,
        },
        {
            name: 'write',
            description:
                'After the ETL process, we also perform our own analysis on the data and present our findings',
            icon: <FaFileAlt />,
        },
        {
            name: 'develop',
            description:
                'Develop models, tools and apps that make use of our datasets',
            icon: <FaCode />,
        },
        {
            name: 'Share',
            description:
                'We share our findings, apps, datasets and tools with the world',
            icon: <FaShareAlt />,
        },
    ]
    return (
        <Box
            as={motion.div}
            initial={{ y: 100, opacity: 0 }}
            animate={{
                y: 0,
                opacity: 1,
                transition: { duration: 0.5, delay: 0.5 },
            }}
            width={['90%', '90%', '80%', '', '75%']}
            mx='auto'
            height='auto'
            p={['0', '0', '20px 0']}
            my={['0', '0', '2rem']}>
            <Box>
                <Heading fontSize={['2xl', '', '', '', '3xl']} my='2rem'>
                    What we do
                </Heading>
                {isTabletAndUp ? (
                    <Grid
                        gap='1rem'
                        my='1rem'
                        templateColumns={[
                            'repeat(2,1fr)',
                            'repeat(2,1fr)',
                            'repeat(3,1fr)',
                            'repeat(4,1fr)',
                        ]}>
                        {activities.map((activity) => (
                            <Box
                                key={activity.name}
                                height='auto'
                                minHeight='20vh'
                                p='30px'
                                bg={
                                    colorMode === 'light'
                                        ? 'gray.50'
                                        : 'gray.700'
                                }
                                borderRadius='10px'
                                border='2px solid'
                                borderColor={
                                    colorMode === 'light'
                                        ? 'gray.200'
                                        : 'gray.700'
                                }>
                                <IconButton
                                    aria-label='activity icon'
                                    icon={activity.icon}
                                    size='lg'
                                    borderRadius='10px'
                                    fontSize='1.5rem'
                                    colorScheme='brand'
                                />
                                <Text
                                    as='p'
                                    my='1rem'
                                    fontSize={['lg', 'lg', 'lg', 'xl']}>
                                    {activity.description}
                                </Text>
                            </Box>
                        ))}
                    </Grid>
                ) : (
                    <Overflow
                        color={colorMode === 'light' ? 'gray.700' : 'gray.400'}>
                        {activities.map((activity) => (
                            <Box
                                key={activity.name}
                                height='auto'
                                minHeight='20vh'
                                p='30px'
                                minWidth={['100%', '100%', '70%', '50%', '30%']}
                                bg={
                                    colorMode === 'light'
                                        ? 'gray.50'
                                        : 'gray.700'
                                }
                                borderRadius='10px'
                                border='2px solid'
                                borderColor={
                                    colorMode === 'light'
                                        ? 'gray.200'
                                        : 'gray.700'
                                }>
                                <IconButton
                                    aria-label='activity icon'
                                    icon={activity.icon}
                                    size='lg'
                                    borderRadius='10px'
                                    fontSize='1.5rem'
                                    colorScheme='brand'
                                />
                                <Text as='p' my='1rem' fontSize='lg'>
                                    {activity.description}
                                </Text>
                            </Box>
                        ))}
                    </Overflow>
                )}
            </Box>
        </Box>
    )
}

export default WhatWeOffer
