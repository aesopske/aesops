import {
    Box,
    useColorMode,
    InputGroup,
    InputLeftElement,
    Input,
    Icon,
} from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'

function AppsFilter() {
    const { colorMode } = useColorMode()
    return (
        <Box
            p='20px'
            bg={colorMode === 'light' ? '#fff' : 'gray.700'}
            borderRadius='10px'
            height='auto'>
            <InputGroup>
                <InputLeftElement mt='5px'>
                    <Icon as={FaSearch} />
                </InputLeftElement>

                <Input placeholder='search by title ...' height='3rem' />
            </InputGroup>
        </Box>
    )
}

export default AppsFilter
