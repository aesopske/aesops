import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        const signIn = new URL(`/sign-in`, request.url)
        signIn.searchParams.set('from', `/datasets/${id}`)
        return NextResponse.redirect(signIn)
    }

    const doc = await documentService.getById(id)
    if (!doc) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // TODO(anti-scraping): once on UploadThing Pro, upload files with acl:'private'
    // and redirect to a short-lived signed URL (utapi.getSignedURL) instead of the
    // permanent public doc.url, plus add rate limiting here.
    return NextResponse.redirect(doc.url)
}
