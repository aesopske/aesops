'use client'

import { useCompletion } from '@ai-sdk/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Stars } from 'lucide-react'
import posthog from 'posthog-js'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { Button } from '@src/components/ui'

type DDExplainProps = {
    data: string
    columns: string[]
    XAxisKey: string
    title: string
    description: string
}

function DDExplain({
    data,
    columns,
    XAxisKey,
    title,
    description,
}: DDExplainProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [useRefreshCache, setUseRefreshCache] = useState(false)

    // if data has changed, useRefreshCache
    useEffect(() => {
        if (data) setUseRefreshCache(true)
    }, [data])

    const { completion, complete, isLoading, error } = useCompletion({
        body: { key: title, useSearch: true, useCache: true, useRefreshCache },
        onError() {
            throw new Error('An error occurred while fetching the completion')
        },
        onFinish: () => setUseRefreshCache(false),
    })

    return (
        <div className='flex min-h-10 flex-col items-start gap-4 bg-brandaccent-50/50 p-4'>
            <Button
                data-open={isOpen}
                variant='outline'
                disabled={isLoading}
                data-loading={isLoading}
                className='group flex h-8 items-center gap-2 rounded-full border-brandprimary-900 bg-transparent data-[open=true]:bg-brandprimary-900 data-[open=true]:text-brandaccent-50 hover:bg-brandprimary-900 hover:text-brandaccent-50 transition-all duration-200 ease-in-out'
                onClick={() => {
                    if (isOpen && !useRefreshCache) return setIsOpen(false)
                    if (!isOpen) setIsOpen(true)

                    posthog.capture('data_digest_explain', {
                        title,
                    })

                    // check if we have a saved explanation
                    if (completion && !useRefreshCache) {
                        setIsOpen(!isOpen)
                        return
                    }

                    const prompt = `
                      Analyze the following oil price dataset to extract insights and discuss potential implications. Focus exclusively on the data provided without introducing external information.

                      Title: ${title}
                      Description: ${description}
                      Columns: ${columns.join(', ')}
                      X-Axis Key: ${XAxisKey}
                      Data: ${JSON.stringify(data)}

                      Your analysis should cover:
                      - Overall trends observed within the dataset.
                      - Notable relationships or correlations between the columns.
                      - Potential impacts or consequences inferred from the observed data trends.

                      Present the insights in a clear and engaging manner, incorporating elements like emojis to enhance readability and interest.Leave out the conclusion section.
                    `

                    complete(prompt)
                }}>
                <Stars
                    size={16}
                    className='group-data-[loading=true]:animate-pulse'
                />
                {isOpen && !useRefreshCache && 'Close'}
                {isOpen && useRefreshCache && 'Refresh Insights'}
                {!isOpen && 'Get Insights'}
            </Button>
            <AnimatePresence initial={false} mode='wait'>
                {isOpen && (
                    <motion.div
                        key={isOpen ? 'explanation' : 'no-explanation'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: '0px' }}
                        transition={{ duration: 0.3 }}
                        className='w-full px-4'>
                        <output
                            data-hidden={!!error}
                            className='prose font-serif text-sm text-brandprimary-900 data-[hidden=true]:hidden'>
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

export default DDExplain
