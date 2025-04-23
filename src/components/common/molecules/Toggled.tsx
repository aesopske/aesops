import React from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import useDisclosure from '@src/hooks/useDisclosure'

type ToggledProps = {
    children: React.ReactNode
    renderTrigger: ({ onToggle }: { onToggle: VoidFunction }) => React.ReactNode // eslint-disable-line
}

// build a toggle component that on desktop uses the accordion and on mobile uses the drawer
function Toggled({ children, renderTrigger }: ToggledProps) {
    const { isOpen, onToggle } = useDisclosure(false)
    return (
        <div>
            <div>
                <div>{renderTrigger({ onToggle })}</div>
                {isOpen && <div className='hidden lg:block'>{children}</div>}
            </div>

            <Drawer>
                <DrawerTrigger asChild className='lg:hidden'>
                    {renderTrigger({ onToggle })}
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Drawer</DrawerTitle>
                        <DrawerDescription>Description </DrawerDescription>
                    </DrawerHeader>
                    {children}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default Toggled
