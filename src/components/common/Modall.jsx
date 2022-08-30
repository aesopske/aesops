import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    Divider,
    useColorMode,
} from '@chakra-ui/react'

function Modall({ onClose, isOpen, size = 'md', title, children }) {
    const { colorMode } = useColorMode()
    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            size={size}
            isCentered
            motionPreset='scale'
            scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent p='20px' borderRadius='10px'>
                <ModalCloseButton
                    top='1rem'
                    right='1rem'
                    _active={{ outline: 'none' }}
                    _focus={{ outline: 'none' }}
                    bg={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                />
                <ModalHeader
                    fontFamily='Roboto'
                    mt='1rem'
                    fontWeight='800'
                    fontSize='1.5rem'>
                    {title}
                </ModalHeader>
                <Divider mb='1rem' />
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default Modall
