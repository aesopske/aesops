import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { env } from '@/env'

type RevalidatePayload = {
    _type?: string
    slug?: string
}

export async function POST(req: NextRequest) {
    const secret = env.SANITY_REVALIDATE_SECRET
    if (!secret) {
        return NextResponse.json(
            { message: 'SANITY_REVALIDATE_SECRET is not configured' },
            { status: 500 },
        )
    }

    const signature = req.headers.get(SIGNATURE_HEADER_NAME)
    const body = await req.text()

    if (!signature || !(await isValidSignature(body, signature, secret))) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    let payload: RevalidatePayload
    try {
        payload = JSON.parse(body) as RevalidatePayload
    } catch {
        return NextResponse.json({ message: 'Invalid body' }, { status: 400 })
    }

    const { _type, slug } = payload

    // Nav links / site-wide chrome live on siteSettings and feed the shared layout.
    if (_type === 'siteSettings') {
        revalidateTag('sanity:navLinks', 'max')
    }

    // Every content page (incl. blog posts, which are `page` docs) shares the
    // page tag; the slug-scoped tag + path target the single edited document.
    revalidateTag('sanity:page', 'max')
    if (slug) {
        revalidateTag(`sanity:page:${slug}`, 'max')
        revalidatePath(`/${slug}`)
    }

    return NextResponse.json({
        revalidated: true,
        type: _type ?? null,
        slug: slug ?? null,
        now: Date.now(),
    })
}
