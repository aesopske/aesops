import { Body, Container, Font, Head, Heading, Hr, Html, Img, Link, Preview, Tailwind, Text } from 'react-email'
import type { ReactNode } from 'react'
import { emailTailwindConfig } from '../tailwind-config'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aesops.co.ke'

type Props = {
    previewText: string
    heading?: string
    children: ReactNode
}

export function EmailLayout({ previewText, heading, children }: Props) {
    return (
        <Html>
            <Head />
            <Font
                fontFamily='Bricolage Grotesque'
                fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
                webFont={{
                    url: 'https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9H6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiawA1XphjhQYg.woff2',
                    format: 'woff2',
                }}
                fontWeight={400}
                fontStyle='normal'
            />
            <Preview>{previewText}</Preview>
            <Tailwind config={emailTailwindConfig}>
                <Body className='bg-background font-sans'>
                    <Container className='mx-auto max-w-[480px] px-6 py-12'>
                        {heading && (
                            <Heading className='m-0 mb-8 text-[26px] font-extrabold tracking-tight text-foreground'>
                                {heading}
                            </Heading>
                        )}

                        {children}

                        <Hr className='my-10 border-border' />

                        <Img src={`${baseUrl}/logo-mark.svg`} width='28' height='28' alt='Aesops' />
                        <Text className='m-0 mt-3 text-[12px] leading-[20px] text-muted'>
                            <Link href={baseUrl} className='text-muted underline'>
                                Aesops
                            </Link>
                            , Africa&rsquo;s open data platform
                            <br />
                            Nairobi, Kenya
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
