'use client'

import { useCompletion } from 'ai/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Stars } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import { Button } from '@src/components/ui'

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
    // store the explanation session store to avoid re-explaining the same code
    const { completion, complete, isLoading, error } = useCompletion({
        body: { key: code?._key },
    })

    return (
        <div className='flex min-h-10 flex-col items-start gap-4 bg-brandaccent-50 px-4 py-2'>
            <Button
                data-open={isOpen}
                variant='outline'
                disabled={isLoading}
                data-loading={isLoading}
                className='group flex h-8 items-center gap-2 rounded-full border-brandprimary-900 bg-transparent data-[open=true]:bg-brandprimary-900 data-[open=true]:text-brandaccent-50 hover:bg-brandprimary-900 hover:text-brandaccent-50 transition-all duration-200 ease-in-out'
                onClick={() => {
                    if (isOpen) return setIsOpen(false)

                    // check if we have a saved explanation
                    if (completion) {
                        setIsOpen(!isOpen)
                        return
                    }

                    // open the panel and stream the generated explanation
                    setIsOpen(!isOpen)
                    const language =
                        code?.code?.language === 'sh'
                            ? 'bash'
                            : code?.code?.language
                    const prompt = `Explain briefly in point form and without an introduction or conclusion, the following ${language} code: \n\n${code?.code?.code}`
                    complete(prompt)
                }}>
                <Stars
                    size={16}
                    className='group-data-[loading=true]:animate-pulse'
                />
                {isOpen ? 'Close' : 'Explain'}
            </Button>
            <AnimatePresence initial={false} mode='wait'>
                {isOpen && (
                    <motion.div
                        key={isOpen ? 'explanation' : 'no-explanation'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: '0px' }}
                        transition={{ duration: 0.3 }}
                        className='w-full'>
                        <output
                            data-hidden={!!error}
                            className='prose font-m ono text-sm text-brandprimary-900 data-[hidden=true]:hidden'>
                            <ReactMarkdown>{completion}</ReactMarkdown>
                        </output>
                        {error && isOpen ? (
                            <output className='prose text-xs text-red-500'>
                                {error?.message}
                            </output>
                        ) : null}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CodeExplain
