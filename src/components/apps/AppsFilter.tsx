import { Box, useColorMode } from '@chakra-ui/react'

import Search from '@/components/common/Search'

type AppsFilterProps = {
    searchTerm: string
    setSearchTerm: (term: string) => void // eslint-disable-line no-unused-vars
}

function AppsFilter({ searchTerm, setSearchTerm }: AppsFilterProps) {
    const { colorMode } = useColorMode()
    return (
        <Box
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            borderRadius='10px'
            minHeight='10vh'>
            <Search
                placeholder='Search by title ...'
                label='Search for app'
                full
                setTerm={setSearchTerm}
                term={searchTerm}
            />
        </Box>
    )
}

export default AppsFilter
