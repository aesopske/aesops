import { Box, useColorMode } from '@chakra-ui/react'
import Search from '../common/Search'

function AppsFilter({ searchTerm, setSearchTerm }) {
    const { colorMode } = useColorMode()
    return (
        <Box
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            borderRadius='10px'
            height={['20vh', '20vh', '20vh', '20vh', '17vh', '15vh']}>
            <Search
                placeholder='search by title or category ...'
                label='Search for app'
                full
                setTerm={setSearchTerm}
                term={searchTerm}
            />
        </Box>
    )
}

export default AppsFilter
