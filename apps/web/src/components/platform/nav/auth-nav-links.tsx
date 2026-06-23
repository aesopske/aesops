'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useNavbarContext } from '@repo/ui/components/navbar-context'
import { cn } from '@/lib/utils'

const AUTH_PATHS = ['/sign-in', '/sign-up']

export function AuthNavLinks() {
    const pathname = usePathname()
    const { isGreen } = useNavbarContext()
    const from =
        pathname && !AUTH_PATHS.some((p) => pathname.startsWith(p))
            ? `?from=${encodeURIComponent(pathname)}`
            : ''

    return (
        <>
            <Link
                href={`/sign-in${from}`}
                className={cn(
                    'text-sm font-medium transition-colors',
                    isGreen
                        ? 'text-primary-foreground/75 hover:text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                )}>
                Sign in
            </Link>
            <Link
                href={`/sign-up${from}`}
                className={cn(
                    'rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                    isGreen
                        ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                        : 'bg-foreground text-background hover:bg-foreground/85',
                )}>
                Get started
            </Link>
        </>
    )
}
