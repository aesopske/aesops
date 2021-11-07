import { IconButton } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { Tooltip } from '@chakra-ui/react'
import { FaArrowUp } from 'react-icons/fa'

function Backtop({ scroll }) {
    const backToTop = () => {
        window.scrollTo(0, 0)
    }

    return (
        <Box position='fixed' bottom='3rem' right='3rem'>
            {scroll === true ? (
                <Tooltip label='Back to the top' hasArrow placement='bottom'>
                    <IconButton
                        borderRadius='10px'
                        height='50px'
                        width='50px'
                        bg='brand.primary'
                        color='#fff'
                        _hover={{ bg: 'brand.primary', color: '#fff' }}
                        _focus={{
                            bg: 'brand.primary',
                            color: '#fff',
                            outline: 'none',
                        }}
                        _active={{
                            bg: 'brand.primary',
                            color: '#fff',
                            outline: 'none',
                        }}
                        icon={<FaArrowUp />}
                        onClick={backToTop}
                    />
                </Tooltip>
            ) : null}
        </Box>
    )
}

export default Backtop
