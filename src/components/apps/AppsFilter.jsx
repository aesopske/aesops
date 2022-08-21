import { Box, useColorMode } from '@chakra-ui/react'
import Search from '../common/Search'

function AppsFilter({ searchTerm, setSearchTerm }) {
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
