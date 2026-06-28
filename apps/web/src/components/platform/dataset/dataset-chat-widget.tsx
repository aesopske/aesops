'use client'

import { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@repo/ui/components/drawer'
import { DatasetChat } from './dataset-chat'

type StoredMessage = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

type Props = {
    datasetId: string
    initialMessages?: StoredMessage[]
}

export function DatasetChatWidget({ datasetId, initialMessages }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    )

    const portal = (
        <>
            {/* ── Mobile FAB + Drawer (lg:hidden) ──────────────── */}
            <div className='lg:hidden fixed bottom-6 right-6 z-50'>
                <button
                    onClick={() => setDrawerOpen(true)}
                    aria-label='Ask the data'
                    className='flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95'>
                    <Sparkles size={22} />
                </button>
            </div>

            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerContent className='h-[85dvh] p-0 lg:hidden'>
                    <DrawerHeader className='border-b border-border px-5 py-3'>
                        <div className='flex items-center gap-2'>
                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary'>
                                <Sparkles size={13} />
                            </div>
                            <DrawerTitle className='text-sm font-medium'>
                                Ask the data
                            </DrawerTitle>
                        </div>
                    </DrawerHeader>
                    <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
                        <DatasetChat
                            datasetId={datasetId}
                            initialMessages={initialMessages}
                            className='flex-1 min-h-0 rounded-none border-0 shadow-none'
                        />
                    </div>
                </DrawerContent>
            </Drawer>

            {/* ── Desktop docked bar (hidden on mobile) ────────── */}
            <div
                className='hidden lg:flex fixed bottom-0 right-6 z-50 w-[520px] flex-col overflow-hidden rounded-t-xl bg-card'
                style={{
                    filter: 'drop-shadow(0 -4px 24px rgb(0 0 0 / 0.12))',
                }}>
                <button
                    onClick={() => setIsOpen((o) => !o)}
                    className='flex w-full items-center gap-3 bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary-foreground/15'>
                        <Sparkles size={14} />
                    </div>
                    <span className='flex-1 text-left text-sm font-medium'>
                        Ask the data
                    </span>
                    {isOpen ? (
                        <ChevronDown size={15} />
                    ) : (
                        <ChevronUp size={15} />
                    )}
                </button>

                <div
                    className={`flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${
                        isOpen
                            ? 'h-[600px] opacity-100'
                            : 'h-0 opacity-0 pointer-events-none'
                    }`}>
                    <DatasetChat
                        datasetId={datasetId}
                        initialMessages={initialMessages}
                        className='flex-1 min-h-0 rounded-none border-0 shadow-none'
                    />
                </div>
            </div>
        </>
    )

    return mounted ? createPortal(portal, document.body) : null
}
