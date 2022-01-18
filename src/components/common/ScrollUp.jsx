import { IconButton } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { Tooltip } from '@chakra-ui/react'
import { FaArrowUp } from 'react-icons/fa'

function Backtop({ scroll }) {
    const backToTop = () => {
        window.scrollTo(0, 0)
    }

    return (
        <Box
            position='fixed'
            bottom={['8rem', '', '', '3rem']}
            right={['1rem', '', '', '3rem']}
            zIndex='20'>
            {scroll === true ? (
                <Tooltip label='Back to the top' hasArrow placement='bottom'>
                    <IconButton
                        borderRadius='8px'
                        height='40px'
                        width='40px'
                        bg='purple.100'
                        fontSize='0.9rem'
                        color='brand.primary'
                        _hover={{ bg: 'purple.200' }}
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
                </Tooltip>
            ) : null}
        </Box>
    )
}

export default Backtop
