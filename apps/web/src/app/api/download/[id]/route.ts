import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@repo/auth'
import { documentService } from '@repo/storage'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.redirect(new URL(`/sign-in`, request.url))
    }

    const { id } = await params
    const doc = await documentService.getById(id)
    if (!doc) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.redirect(doc.url)
}
