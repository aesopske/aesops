import React from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useColorMode, HStack, Text, IconButton } from '@chakra-ui/react'

function ThemeSwitcher({ hasText, text }) {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <HStack onClick={toggleColorMode}>
            <IconButton
                aria-label='Toggle dark and light mode'
                _hover={{ bg: 'transparent' }}
                _focus={{
                    outlineColor: 'transparent',
                    bg: 'transparent',
                }}
                _active={{
                    transform: 'rotate(360deg)',
                    transition: 'transform .5s ease-in-out',
                    bg: 'transparent',
                }}
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                fontSize='lg'
                borderRadius='lg'
                bg='transparent'
                cursor='pointer'
            />

            {hasText && (
                <Text fontSize='0.9rem' fontFamily='Roboto'>
                    {text}
                </Text>
            )}
        </HStack>
    )
}

ThemeSwitcher.defaultProps = {
    hasText: false,
    text: 'Theme',
}

export default ThemeSwitcher
