'use client'

import { useCompletion } from '@ai-sdk/react'
import { Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'

type CodeExplainProps = {
    code: {
        _key?: string | null
        _type?: string | null
        allowAIExplain?: boolean
        code: {
            language: string
            code: string
            filename?: string
        }
    }
}

function CodeExplain({ code }: CodeExplainProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { completion, complete, isLoading, error } = useCompletion({
        body: { key: code?._key, useCache: true },
    })

    const handleClick = () => {
        if (isOpen) return setIsOpen(false)
        setIsOpen(true)
        if (completion) return
        const language =
            code?.code?.language === 'sh' ? 'bash' : code?.code?.language
        complete(
            `Explain briefly in point form, without an introduction or conclusion, the following ${language} code:\n\n${code?.code?.code}`,
        )
    }

    return (
        <div className='border-t border-[#d5c4a1] bg-brandaccent-50'>
            <div className='flex items-center gap-3 px-4 py-3'>
                <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className='inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-wide text-[#7c6f64] hover:text-[#3c3836] transition-colors duration-150 disabled:opacity-40'>
                    <Sparkles
                        size={12}
                        className={
                            isLoading ? 'animate-pulse text-[#79740e]' : ''
                        }
                    />
                    {isLoading
                        ? 'Explaining…'
                        : isOpen
                          ? 'Hide explanation'
                          : 'Explain with AI'}
                </button>
            </div>

            {isOpen && (
                <div className='overflow-hidden'>
                    <div className='px-4 pb-4'>
                        {error ? (
                            <p className='text-xs font-mono text-[#9d0006]'>
                                {error.message}
                            </p>
                        ) : (
                            <div className='prose prose-sm max-w-none font-mono text-xs text-[#504945] leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_li]:text-[#504945] [&_p]:text-[#504945] [&_strong]:text-[#3c3836]'>
                                <ReactMarkdown>{completion}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CodeExplain
