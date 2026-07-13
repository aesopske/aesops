import 'server-only'
import { env } from '@/env'

function adminEmailSet(): Set<string> {
    return new Set(
        (env.ADMIN_EMAILS ?? '')
            .split(',')
            .map((email: string) => email.trim().toLowerCase())
            .filter(Boolean),
    )
}

export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false
    return adminEmailSet().has(email.toLowerCase())
}
