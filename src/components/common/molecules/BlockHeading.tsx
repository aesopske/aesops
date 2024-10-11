'use client'

import speakingUrl from 'speakingurl'
import React from 'react'
// import { useHeadingObserver } from '@src/context/HeadingObserverProvider'
import Heading from '@components/common/atoms/Heading'

function BlockHeading({ children, type }) {
    // const { ref, headingsInView } = useHeadingObserver()
    const url = children[0]?.props?.text
        ? children[0]?.props?.text
        : children[0]

    const id = speakingUrl(url ?? '')

    return (
        <Heading id={id} type={type}>
            {children}
        </Heading>
    )
}

export default BlockHeading
