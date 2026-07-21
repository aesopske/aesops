import { Body, Container, Head, Hr, Html, Preview, Tailwind, Text } from 'react-email'
import type { ReactNode } from 'react'
import { emailTailwindConfig } from '../tailwind-config'

type Props = {
    previewText: string
    children: ReactNode
}

export function EmailLayout({ previewText, children }: Props) {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind config={emailTailwindConfig}>
                <Body className='m-0 bg-background py-8 font-sans'>
                    <Container className='max-w-[480px] rounded-xl border border-border bg-card px-10 py-8'>
                        <Text className='m-0 mb-6 text-xl font-bold text-primary'>aesops</Text>
                        {children}
                        <Hr className='my-8 border-border' />
                        <Text className='m-0 text-xs text-muted'>
                            Aesops · Africa&rsquo;s open data platform · aesops.co.ke
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
