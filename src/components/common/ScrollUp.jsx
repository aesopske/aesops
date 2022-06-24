import { Box, IconButton, useColorMode } from '@chakra-ui/react'
import { FaArrowUp } from 'react-icons/fa'

function Backtop({ scroll }) {
    const { colorMode } = useColorMode()
    const backToTop = () => {
        window.scrollTo(0, 0)
    }

    return (
        <Box
            position='fixed'
            bottom={['6rem', '', '', '3rem']}
            right={['1rem', '', '', '3rem']}
            zIndex='20'>
            {scroll === true ? (
                <IconButton
                    borderRadius='10px'
                    height='45px'
                    width='45px'
                    bg={colorMode === 'light' ? 'brand.primary' : 'brand.muted'}
                    fontSize='0.9rem'
                    color='gray.100'
                    _hover={{ bg: 'brand.hover' }}
                    _focus={{
                        bg:
                            colorMode === 'light'
                                ? 'brand.primary'
                                : 'brand.muted',
                    }}
                    _active={{
                        bg:
                            colorMode === 'light'
                                ? 'brand.primary'
                                : 'brand.muted',
                    }}
                    icon={<FaArrowUp />}
                    onClick={backToTop}
                />
            ) : null}
        </Box>
    )
}

export default Backtop
