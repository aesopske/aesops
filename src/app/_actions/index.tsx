'use server'

import { Resend } from 'resend'
import 'server-only'
import { env } from '@src/env'

const resend = new Resend(env.RESEND_API_KEY)

// Subscribe | Add contact to resend list
type SubscribeDetails = {
    email: string
    name?: string
    tags?: string[]
}
export const subscribe = async (details: SubscribeDetails) => {
    if (!details.email) throw new Error('Email is required')

    // check if contact already exists

    return resend.contacts.create({
        email: details.email,
        firstName: '',
        lastName: '',
        unsubscribed: false,
        audienceId: env.RESEND_AUDIENCE_ID,
    })
}
