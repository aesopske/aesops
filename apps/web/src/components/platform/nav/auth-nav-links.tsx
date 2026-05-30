'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AUTH_PATHS = ['/sign-in', '/sign-up']

export function AuthNavLinks() {
    const pathname = usePathname()
    const from =
        pathname && !AUTH_PATHS.some((p) => pathname.startsWith(p))
            ? `?from=${encodeURIComponent(pathname)}`
            : ''

    return (
        <>
            <Link
                href={`/sign-in${from}`}
                className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
                Sign in
            </Link>
            <Link
                href={`/sign-up${from}`}
                className='rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85'>
                Get started
            </Link>
        </>
    )
}
