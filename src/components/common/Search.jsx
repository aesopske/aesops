import React from 'react'
import {
    Box,
    FormControl,
    FormLabel,
    InputGroup,
    Input,
    Icon,
    InputLeftElement,
    InputRightElement,
    useColorMode,
} from '@chakra-ui/react'
import { FaSearch, FaTimes } from 'react-icons/fa'

function Search({
    setTerm,
    term,
    label,
    placeholder = 'search',
    full = false,
}) {
    const { colorMode } = useColorMode()
    return (
        <Box height='auto' width='auto'>
            <FormControl
                height='3rem'
                width={
                    full ? '100%' : ['100%', '100%', '90%', '40%', '60%', '60%']
                }>
                <FormLabel fontWeight='600' fontSize='1.2rem' color='gray.500'>
                    {label}
                </FormLabel>
                <InputGroup height='3rem'>
                    <InputLeftElement fontSize='1rem' height='100%'>
                        <Icon
                            as={FaSearch}
                            fontSize='1.2rem'
                            color='gray.500'
                        />
                    </InputLeftElement>
                    <Input
                        p='10px 50px'
                        borderRadius='10px'
                        value={term}
                        width='100%'
                        color='gray.500'
                        border='2px solid'
                        borderColor={
                            colorMode === 'light' ? 'gray.300' : 'gray.700'
                        }
                        _focus={{
                            outlineColor: 'gray.500',
                        }}
                        placeholder={placeholder}
                        onChange={(e) => setTerm(e.target.value)}
                        height='3rem'
                    />

                    {term && (
                        <InputRightElement
                            fontSize='1rem'
                            height='100%'
                            cursor='pointer'
                            onClick={() => setTerm('')}>
                            <Icon
                                as={FaTimes}
                                fontSize='1.2rem'
                                color='gray.500'
                            />
                        </InputRightElement>
                    )}
                </InputGroup>
            </FormControl>
        </Box>
    )
}

export default Search
