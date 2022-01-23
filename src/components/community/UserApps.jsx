import {
    Box,
    Heading,
    ListItem,
    UnorderedList,
    useColorMode,
} from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'

function UserApps({ apps = [] }) {
    const { colorMode } = useColorMode()
    return (
        <Box>
            <Heading size='md'>Apps : {apps.length}</Heading>
            <UnorderedList mt='0.5rem'>
                {apps &&
                    apps.map((item) => (
                        <Link
                            key={item._id}
                            href={`/apps/${item?.slug}`}
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

UserApps.defaultProps = {
    apps: [],
}

export default UserApps
