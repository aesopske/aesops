'use client'

import { useEffect, useState } from 'react'

function useCopy() {
    const [copied, setCopied] = useState(false)

    const onCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
    }

    useEffect(() => {
        if (copied) {
            const timeout = setTimeout(() => {
                setCopied(false)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [copied])

    return {
        onCopy,
        copied,
    }
}
export default useCopy
