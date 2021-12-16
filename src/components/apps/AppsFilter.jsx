import { Box, useColorMode } from '@chakra-ui/react'
import Search from '../common/Search'
import { useState } from 'react'

function AppsFilter() {
    const { colorMode } = useColorMode()
    const [searchTerm, setSearchTerm] = useState('')
    return (
        <Box
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            borderRadius='10px'
            height='auto'
            minHeight='15vh'>
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
