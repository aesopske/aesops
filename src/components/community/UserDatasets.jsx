import {
    Box,
    Heading,
    ListItem,
    UnorderedList,
    useColorMode,
} from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'

function UserDatasets({ datasets = [] }) {
    const { colorMode } = useColorMode()
    return (
        <Box>
            <Heading size='md'>Datasets : {datasets.length}</Heading>
            <UnorderedList mt='0.5rem'>
                {datasets &&
                    datasets.map((item) => (
                        <Link
                            key={item._id}
                            href={`/datasets/${item?.slug}`}
                            passHref>
                            <ListItem
                                _hover={{
                                    textDecor: 'underline',
                                    color:
                                        colorMode === 'light'
                                            ? 'brand.primary'
                                            : 'brand.muted',
                                }}
                                cursor='pointer'>
                                {item?.title}
                            </ListItem>
                        </Link>
                    ))}
            </UnorderedList>
        </Box>
    )
}

UserDatasets.defaultProps = {
    datasets: [],
}

export default UserDatasets
