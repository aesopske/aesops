import React from 'react'
import {
    Text,
    Box,
    Heading,
    IconButton,
    Grid,
    useColorMode,
} from '@chakra-ui/react'
import { FaDatabase, FaFileAlt, FaShareAlt, FaCode } from 'react-icons/fa'

function WhatWeOffer() {
    const { colorMode } = useColorMode()
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
            width={['90%', '90%', '80%']}
            mx='auto'
            height='auto'
            p={['0', '0', '50px 0']}
            my={['0', '0', '5rem']}>
            <Box>
                <Heading size='xl' my='3rem'>
                    What we bring you
                </Heading>
                <Grid
                    gap='1rem'
                    my='1rem'
                    templateColumns={[
                        'repeat(1,1fr)',
                        'repeat(1,1fr)',
                        'repeat(3,1fr)',
                        'repeat(4,1fr)',
                    ]}>
                    {activities.map((activity) => (
                        <Box
                            key={activity.name}
                            height='auto'
                            minHeight='20vh'
                            p='30px'
                            borderRadius='10px'
                            border='2px solid'
                            borderColor={
                                colorMode === 'light' ? '#eee' : 'gray.700'
                            }>
                            <IconButton
                                icon={activity.icon}
                                size='lg'
                                borderRadius='10px'
                                fontSize='1.5rem'
                                bg='purple.100'
                                color='brand.primary'
                            />
                            <Text
                                as='p'
                                my='1rem'
                                fontSize={[
                                    '1rem',
                                    '1rem',
                                    '',
                                    '',
                                    '',
                                    '1.1rem',
                                ]}>
                                {activity.description}
                            </Text>
                        </Box>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}

export default WhatWeOffer
