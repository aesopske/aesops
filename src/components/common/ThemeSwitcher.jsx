import React from 'react'

import { FaSun, FaMoon } from 'react-icons/fa'
import { Icon, useColorMode, Tooltip } from '@chakra-ui/react'

function ThemeSwitcher() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Tooltip label='light or dark theme' placement='right-end'>
            <Icon
                onClick={toggleColorMode}
                as={colorMode === 'light' ? FaMoon : FaSun}
                fontSize='1.2rem'
                cursor='pointer'
            />
        </Tooltip>
    )
}

export default ThemeSwitcher
