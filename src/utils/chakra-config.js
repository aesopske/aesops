import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints, mode } from '@chakra-ui/theme-tools'

const breakpoints = createBreakpoints({
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
})

const colors = {
    brand: {
        primary: '#6f0dcc',
        muted: '#9b5fd3',
        hover: '#6f0daa',
        gradient: 'linear(to-r,#804fadcc, #700dccc0 )',
    },
}

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const styles = {
    global: (props) => ({
        body: {
            color: mode('gray.800', 'whiteAlpha.900')(props),
            bg: mode('gray.50', 'gray.800')(props),
        },
    }),
}

export const theme = extendTheme({
    ...config,
    breakpoints,
    colors,
    styles,
    fonts: {
        heading: 'Poppins',
        body: 'Poppins',
        mono: 'Overpass Mono',
    },
})
