import Layout from '@/components/common/Layout'
import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import MarkdownReader from '@/components/common/MarkdownReader'
import { Box, Text } from '@chakra-ui/react'
import PageBanner from '@/components/common/PageBanner'

type policy = {
    data: {
        dateUpdated: string
    }
    content: string
}

type PrivacyPolicyProps = {
    policy: policy
}

function PrivacyPolicy({ policy }: PrivacyPolicyProps) {
    return (
        <Layout
            title='Privacy Policy'
            description='Aesops legal data privacy policy that highlights how we use the data we collect'>
            <Box
                width={['90%', '90%', '80%', '', '', '75%']}
                mx='auto'
                fontSize='lg'
                my='3rem'>
                <PageBanner heading='Data Privacy Policy'>
                    <Text as='p' fontSize='lg'>
                        Aesops legal data privacy policy that highlights how we
                        use the data we collect
                    </Text>

                    <Text as='p' mt='1rem'>
                        Last Updated: {policy?.data.dateUpdated}
                    </Text>
                </PageBanner>
                <Box width={['100%', '100%', '90%', '80%']} mx='auto'>
                    <MarkdownReader content={policy?.content} />
                </Box>
            </Box>
        </Layout>
    )
}

export async function getStaticProps() {
    const path = `${process.cwd()}/src/content/legal/Privacy-policy.md`
    const rawContent = fs.readFileSync(path, { encoding: 'utf-8' })
    const { data, content } = matter(rawContent)

    return {
        props: { policy: { data, content } },
    }
}

export default PrivacyPolicy
