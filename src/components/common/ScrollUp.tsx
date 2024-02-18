import { Box, IconButton } from '@chakra-ui/react'
import { FaArrowUp } from 'react-icons/fa'
import { ArrowUp } from 'lucide-react'
import { Button } from '../ui'
import { AnimatePresence, motion } from 'framer-motion'

function Backtop({ scroll }) {
    const backToTop = () => {
        window.scrollTo(0, 0)
    }

    return (
        <AnimatePresence initial={false} mode='wait'>
            {scroll ? (
                <motion.button
                    data-hidden={scroll ? 'true' : 'false'}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={backToTop}
                    className='hidden fixed bottom-6 right-6 z-20 bg-aes-light border border-gray-50 w-14 h-14 items-center justify-center rounded-full shadow-md md:flex'>
                    <ArrowUp className='h-6 w-6' />
                </motion.button>
            ) : null}
        </AnimatePresence>
    )
}

export default Backtop
