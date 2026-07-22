import { Text } from 'react-email'
import { EmailLayout } from './EmailLayout'

type Props = { otp: string }

export function SignInCodeEmail({ otp }: Props) {
    return (
        <EmailLayout previewText={`${otp} is your Aesops sign-in code`} heading='Sign in'>
            <Text className='m-0 mb-4 text-[14px] text-foreground'>Use this code to sign in to Aesops:</Text>
            <code className='inline-block rounded-md border border-solid border-border bg-code px-6 py-4 font-mono text-[26px] font-semibold tracking-[6px] text-foreground'>
                {otp}
            </code>
            <Text className='m-0 mt-6 text-[13px] text-muted'>
                This code expires in 5 minutes. If you didn&rsquo;t request this, you can safely ignore this email.
            </Text>
        </EmailLayout>
    )
}
