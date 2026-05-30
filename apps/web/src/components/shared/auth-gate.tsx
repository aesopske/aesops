import type { ReactNode } from 'react'

type Props = {
    isLoggedIn: boolean
    children: ReactNode
    fallback?: ReactNode
}

export function AuthGate({ isLoggedIn, children, fallback = null }: Props) {
    return isLoggedIn ? <>{children}</> : <>{fallback}</>
}
