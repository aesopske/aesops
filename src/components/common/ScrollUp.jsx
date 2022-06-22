import { Box, IconButton } from '@chakra-ui/react'
import { FaArrowUp } from 'react-icons/fa'

function Backtop({ scroll }) {
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
                    bg='brand.primary'
                    fontSize='0.9rem'
                    color='gray.100'
                    _hover={{ bg: 'brand.muted' }}
                    _focus={{
                        bg: 'purple.100',
                        outline: 'none',
                    }}
                    _active={{
                        bg: 'purple.100',
                        outline: 'none',
                    }}
                    icon={<FaArrowUp />}
                    onClick={backToTop}
                />
            ) : null}
        </Box>
    )
}

export default Backtop
