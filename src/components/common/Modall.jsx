import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    Divider,
} from '@chakra-ui/react'

function Modall({ onClose, isOpen, size = 'md', title, children }) {
    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            size={size}
            isCentered
            motionPreset='scale'>
            <ModalOverlay />
            <ModalContent p='20px' borderRadius='10px'>
                <ModalCloseButton top='1rem' right='1rem' bg='gray.100' />
                <ModalHeader mt='1rem' fontWeight='800' fontSize='1.5rem'>
                    {title}
                </ModalHeader>
                <Divider mb='1rem' />
                <ModalBody>{children}</ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default Modall
