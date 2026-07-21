import { Button, Text } from 'react-email'
import { EmailLayout } from './EmailLayout'

type Props = { name: string }

export function WelcomeEmail({ name }: Props) {
    return (
        <EmailLayout previewText='Welcome to Aesops'>
            <Text className='m-0 mb-4 text-[15px] text-[#1A1A1A]'>Hi {name},</Text>
            <Text className='m-0 mb-6 text-[15px] text-[#1A1A1A]'>
                Welcome to Aesops — Africa&rsquo;s open data platform. Upload, explore, and share datasets with a
                community building on Kenya&rsquo;s data ecosystem.
            </Text>
            <Button
                href='https://aesops.co.ke/datasets'
                className='box-border rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white'>
                Browse datasets
            </Button>
        </EmailLayout>
    )
}
