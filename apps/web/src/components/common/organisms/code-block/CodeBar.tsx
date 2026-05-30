'use client'

import { Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

function CodeBar({ filename, code }: { filename: string; code: string }) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (!copied) return
        const t = setTimeout(() => setCopied(false), 2000)
        return () => clearTimeout(t)
    }, [copied])

    return (
        <div className='flex items-center justify-between px-4 py-3 bg-brandaccent-50 border-b border-[#d5c4a1]'>
            <span className='font-mono text-sm text-[#7c6f64] tracking-wide'>
                {filename || 'code'}
            </span>
            <button
                onClick={() => {
                    if (!navigator.clipboard) return
                    navigator.clipboard.writeText(code)
                    setCopied(true)
                }}
                className='inline-flex items-center gap-1.5 text-[11px] font-mono text-[#7c6f64] hover:text-[#3c3836] transition-colors duration-150 px-2 py-1 rounded-md hover:bg-[#d5c4a1]/50'>
                {copied ? (
                    <Check size={12} className='text-[#79740e]' />
                ) : (
                    <Copy size={12} />
                )}
                {copied ? 'Copied' : 'Copy'}
            </button>
        </div>
    )
}

export default CodeBar
