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
} from '@chakra-ui/react'
import { FaSearch, FaTimes } from 'react-icons/fa'

function Search({
    setTerm,
    term,
    label,
    placeholder = 'search',
    full = false,
}) {
    return (
        <Box height='auto'>
            <FormControl
                height='2.5rem'
                width={full ? '100%' : ['100%', '100%', '90%', '40%', '40%']}>
                <FormLabel fontWeight='600' fontSize='1.2rem' color='gray.500'>
                    {label}
                </FormLabel>
                <InputGroup height='2.5rem'>
                    <InputLeftElement fontSize='1rem' height='100%'>
                        <Icon
                            as={FaSearch}
                            fontSize='1.2rem'
                            color='gray.500'
                        />
                    </InputLeftElement>
                    <Input
                        p='10px 50px'
                        borderRadius='5px'
                        value={term}
                        color='gray.500'
                        _focus={{
                            outlineColor: 'gray.500',
                        }}
                        placeholder={placeholder}
                        onChange={(e) => setTerm(e.target.value)}
                        height='2.5rem'
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
