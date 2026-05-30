'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

type TransitionLinkProps = ComponentProps<typeof Link>

function TransitionLink(props: TransitionLinkProps) {
    return <Link {...props} />
}

export default TransitionLink
