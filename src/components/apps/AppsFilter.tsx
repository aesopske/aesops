import { Box, useColorMode } from '@chakra-ui/react'

import Search from '@/components/common/Search'

type AppsFilterProps = {
    searchTerm: string
    setSearchTerm: (term: string) => void // eslint-disable-line no-unused-vars
}

function AppsFilter({ searchTerm }: AppsFilterProps) {
    const { colorMode } = useColorMode()
    return (
        <Box
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            borderRadius='10px'
            minHeight='10vh'>
            <Search
                full
                placeholder='Search by title ...'
                label='Search for app'
                term={searchTerm}
            />
        </Box>
    )
}

export default AppsFilter
