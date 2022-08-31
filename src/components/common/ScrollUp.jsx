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
                    colorScheme='brand'
                    icon={<FaArrowUp />}
                    onClick={backToTop}
                    aria-label='Back to top'
                />
            ) : null}
        </Box>
    )
}

export default Backtop
