import { Text } from 'react-email'
import { EmailLayout } from './EmailLayout'

type Props = { otp: string }

export function TwoFactorCodeEmail({ otp }: Props) {
    return (
        <EmailLayout previewText={`${otp} is your Aesops verification code`}>
            <Text className='m-0 mb-4 text-[15px] text-[#1A1A1A]'>Your two-factor verification code is:</Text>
            <Text className='m-0 mb-4 text-[32px] font-bold tracking-[6px] text-primary'>{otp}</Text>
            <Text className='m-0 text-[13px] text-muted'>
                This code expires in 5 minutes. If you didn&rsquo;t request this, secure your account and contact
                support.
            </Text>
        </EmailLayout>
    )
}
