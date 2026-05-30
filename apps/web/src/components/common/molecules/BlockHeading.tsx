'use client'

import speakingUrl from 'speakingurl'
import React from 'react'
// import { useHeadingObserver } from '@/context/HeadingObserverProvider'
import Heading from '@components/common/atoms/Heading'

function BlockHeading({
    children,
    type,
}: {
    children: React.ReactNode
    type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}) {
    // const { ref, headingsInView } = useHeadingObserver()
    const childArray = React.Children.toArray(children)
    const url = (childArray[0] as any)?.props?.text
        ? (childArray[0] as any)?.props?.text
        : childArray[0]

    const id = speakingUrl(url ?? '')

    return (
        <Heading id={id} type={type}>
            {children}
        </Heading>
    )
}

export default BlockHeading
