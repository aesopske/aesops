import 'server-only'
import { Resend } from 'resend'
import { emailEnv } from '@repo/env/email'

const resend = new Resend(emailEnv.RESEND_API_KEY)

async function send(to: string, subject: string, text: string) {
    // No Resend key configured yet (e.g. local dev) — log instead of failing
    // every sign-in attempt.
    if (!emailEnv.RESEND_API_KEY) {
        console.log(`[email:dev] ${subject} → ${to}\n${text}`)
        return
    }
    await resend.emails.send({ from: emailEnv.EMAIL_FROM, to, subject, text })
}

export async function sendSignInCode(email: string, otp: string) {
    await send(
        email,
        `${otp} is your Aesops sign-in code`,
        `Your sign-in code is ${otp}. It expires in 5 minutes. If you didn't request this, you can ignore this email.`,
    )
}

export async function sendTwoFactorCode(email: string, otp: string) {
    await send(
        email,
        `${otp} is your Aesops verification code`,
        `Your two-factor verification code is ${otp}. It expires in 5 minutes. If you didn't request this, secure your account and contact support.`,
    )
}
