import 'server-only'
import type { ReactElement } from 'react'
import { resend, emailDeliveryConfigured } from './client'
import { FROM } from './from'
import { SignInCodeEmail } from './templates/SignInCodeEmail'
import { TwoFactorCodeEmail } from './templates/TwoFactorCodeEmail'
import { WelcomeEmail } from './templates/WelcomeEmail'

async function send(params: { from: string; to: string; subject: string; react: ReactElement; logFallback: string }) {
    if (!emailDeliveryConfigured) {
        console.log(`[email:dev] ${params.subject} → ${params.to}\n${params.logFallback}`)
        return
    }
    await resend.emails.send({ from: params.from, to: params.to, subject: params.subject, react: params.react })
}

export async function sendSignInCode(email: string, otp: string) {
    await send({
        from: FROM.auth,
        to: email,
        subject: `${otp} is your Aesops sign-in code`,
        react: <SignInCodeEmail otp={otp} />,
        logFallback: `Sign-in code: ${otp}`,
    })
}

export async function sendTwoFactorCode(email: string, otp: string) {
    await send({
        from: FROM.auth,
        to: email,
        subject: `${otp} is your Aesops verification code`,
        react: <TwoFactorCodeEmail otp={otp} />,
        logFallback: `Two-factor code: ${otp}`,
    })
}

// not wired to a trigger yet — call once there's a defined moment to send it from
export async function sendWelcomeEmail(email: string, name: string) {
    await send({
        from: FROM.welcome,
        to: email,
        subject: 'Welcome to Aesops',
        react: <WelcomeEmail name={name} />,
        logFallback: `Welcome email for ${name}`,
    })
}
