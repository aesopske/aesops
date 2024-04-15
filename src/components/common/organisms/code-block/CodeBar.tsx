'use client'

import { Button } from '@src/components/ui'
import { Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

function CodeBar({ filename, code }) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [copied])
    return (
        <div className='flex items-center justify-between px-4 py-2 bg-aes-light'>
            <span className='font-sans text-sm'>{filename}</span>
            <Button
                variant='outline'
                data-clicked={copied}
                className='flex h-8 cursor-pointer items-center gap-2 space-x-2 rounded-full py-2 data-[clicked=true]:bg-aes-dark data-[clicked=true]:text-aes-light'
                onClick={() => {
                    if (!navigator.clipboard) return
                    navigator.clipboard.writeText(code)
                    setCopied(true)
                }}>
                {copied ? (
                    <Check size={15} />
                ) : (
                    <Copy size={15} className='cursor-pointer' />
                )}
                {copied ? 'Copied!' : 'Copy'}
            </Button>
        </div>
    )
}

export default CodeBar
