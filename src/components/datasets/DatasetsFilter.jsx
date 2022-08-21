import { Box, useColorMode } from '@chakra-ui/react'
import Search from '../common/Search'

function DatasetsFilter({ searchTerm, setSearchTerm }) {
    const { colorMode } = useColorMode()
    return (
        <Box
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            borderRadius='10px'
            minHeight='10vh'>
            <Search
                full
                label='Search for dataset'
                placeholder='search by title or category ...'
                setTerm={setSearchTerm}
                term={searchTerm}
            />
        </Box>
    )
}

export default DatasetsFilter
