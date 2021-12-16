import { Box, useColorMode } from '@chakra-ui/react'
import Search from '../common/Search'

function DatasetsFilter() {
    const { colorMode } = useColorMode()
    return (
        <Box
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            borderRadius='10px'
            height='auto'
            minHeight='15vh'>
            <Search
                full
                label='Search for dataset'
                placeholder='search by title or category ...'
            />
        </Box>
    )
}

export default DatasetsFilter
