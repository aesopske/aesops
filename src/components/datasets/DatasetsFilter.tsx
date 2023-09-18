import { Box, useColorMode } from '@chakra-ui/react'
import Search from '@/components/common/Search'

type DatasetsFilterProps = {
    searchTerm: string
    setSearchTerm: (term: string) => void // eslint-disable-line no-unused-vars
}

function DatasetsFilter({ searchTerm, setSearchTerm }: DatasetsFilterProps) {
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
