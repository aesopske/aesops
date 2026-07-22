import { Text } from 'react-email'
import { EmailLayout } from './EmailLayout'

type Props = {
    source: 'consultation' | 'contact'
    name: string
    email: string
    company?: string | null
    phone?: string | null
    serviceInterest?: string | null
    message: string
}

const SOURCE_LABEL = {
    consultation: 'New consultation request',
    contact: 'New contact message',
} as const

export function LeadNotificationEmail({ source, name, email, company, phone, serviceInterest, message }: Props) {
    return (
        <EmailLayout previewText={`${SOURCE_LABEL[source]} from ${name}`} heading={SOURCE_LABEL[source]}>
            <Text className='m-0 mb-1 text-[14px] text-foreground'>
                <strong>Name:</strong> {name}
            </Text>
            <Text className='m-0 mb-1 text-[14px] text-foreground'>
                <strong>Email:</strong> {email}
            </Text>
            {company && (
                <Text className='m-0 mb-1 text-[14px] text-foreground'>
                    <strong>Company:</strong> {company}
                </Text>
            )}
            {phone && (
                <Text className='m-0 mb-1 text-[14px] text-foreground'>
                    <strong>Phone:</strong> {phone}
                </Text>
            )}
            {serviceInterest && (
                <Text className='m-0 mb-1 text-[14px] text-foreground'>
                    <strong>Service interest:</strong> {serviceInterest}
                </Text>
            )}
            <Text className='m-0 mt-4 mb-1 text-[14px] font-medium text-foreground'>Message:</Text>
            <code className='block whitespace-pre-wrap rounded-md border border-solid border-border bg-code px-4 py-3 text-[13px] text-foreground'>
                {message}
            </code>
        </EmailLayout>
    )
}
