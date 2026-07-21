import { redirect } from 'next/navigation'

// Sign-up is folded into the email-code sign-in flow — no separate step.
export default function SignUpPage() {
    redirect('/sign-in')
}
