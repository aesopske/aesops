import 'server-only'
import { headers } from 'next/headers'
import { auth } from '@repo/auth'

/**
 * `auth.api.getSession()` returns a session even when its second factor is
 * still pending — see the `twoFactorVerified` comment in
 * packages/db/src/schema/auth.ts. Anything gating access to the platform
 * must use this instead of calling `getSession` directly.
 */
export async function getVerifiedSession(requestHeaders?: Headers) {
    const session = await auth.api.getSession({ headers: requestHeaders ?? (await headers()) })
    if (!session) return null
    if (session.session.twoFactorVerified === false) return null
    return session
}
