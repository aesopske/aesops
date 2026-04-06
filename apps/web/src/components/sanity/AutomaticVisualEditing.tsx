'use client'

import React, { useEffect } from 'react'
import { VisualEditing } from 'next-sanity'

function AutomaticVisualEditing() {
    useEffect(() => {
        const previewEnv = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
        if (previewEnv && window === parent) {
            location.href = '/api/preview/disable'
        }
    }, [])
    return <VisualEditing />
}

export default AutomaticVisualEditing
