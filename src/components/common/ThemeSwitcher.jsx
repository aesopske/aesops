import React from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { Icon, useColorMode, HStack, Text } from '@chakra-ui/react'

function ThemeSwitcher({ hasText, text }) {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <HStack onClick={toggleColorMode}>
            <Icon
                as={colorMode === 'light' ? FaMoon : FaSun}
                fontSize='1rem'
                cursor='pointer'
            />

            {hasText && <Text fontSize='0.9rem'>{text}</Text>}
        </HStack>
    )
}

ThemeSwitcher.defaultProps = {
    hasText: false,
    text: 'Theme',
}

export default ThemeSwitcher
