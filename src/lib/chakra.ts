import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
}

const colors = {
    brand: {
        50: '#f6e5ff',
        100: '#dbb6fe',
        200: '#c286f9',
        300: '#a857f5',
        400: '#8f27f1',
        500: '#750ed8',
        600: '#5b09a9',
        700: '#41067a',
        800: '#27034b',
        900: '#0f001e',
    },
}

const config = {
    initialColorMode: 'light',
    useSystemColorMode: true,
}

const styles = {
    global: (props: Record<string, any>) => ({
        body: {
            color: mode('gray.800', 'whiteAlpha.900')(props),
            bg: mode('gray.100', 'gray.800')(props),
        },
    }),
}

export const theme = extendTheme({
    ...config,
    breakpoints,
    colors,
    styles,
    fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'Roboto Mono',
    },
})
