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
            description: 'Collect / Clean datasets',
            icon: <FaDatabase />,
        },
        {
            name: 'write',
            description: 'Write about findings',
            icon: <FaFileAlt />,
        },
        {
            name: 'develop',
            description: 'Develop apps that make use of our datasets',
            icon: <FaCode />,
        },
        {
            name: 'Share',
            description: 'We share out findings, apps, datasets with the world',
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
            <Box ml='1rem'>
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
                            <Text as='p' my='1rem' fontSize='1rem'>
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
