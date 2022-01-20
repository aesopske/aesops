import React from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { Icon, useColorMode, Tooltip, HStack, Text } from '@chakra-ui/react'

function ThemeSwitcher({ hasText, text }) {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Tooltip label='light or dark theme' placement='bottom' hasArrow>
            <HStack onClick={toggleColorMode}>
                <Icon
                    as={colorMode === 'light' ? FaMoon : FaSun}
                    fontSize='1rem'
                    cursor='pointer'
                />

                {hasText && <Text fontSize='0.9rem'>{text}</Text>}
            </HStack>
        </Tooltip>
    )
}

ThemeSwitcher.defaultProps = {
    hasText: false,
    text: 'Theme',
}

export default ThemeSwitcher
