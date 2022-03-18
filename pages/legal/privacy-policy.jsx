import Layout from '@/src/components/common/Layout'
import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import MarkdownReader from '@/src/components/common/MarkdownReader'
import { Box } from '@chakra-ui/react'

function PrivacyPolicy({ policy }) {
    return (
        <Layout
            title='Privacy Policy'
            description='Aesops legal data privacy policy that highlights how we use the data we collect'>
            <Box width='80%' mx='auto' mb='3rem'>
                <MarkdownReader content={policy?.content} />
            </Box>
        </Layout>
    )
}

export async function getStaticProps() {
    const path = `${process.cwd()}/content/legal/Privacy-policy.md`

    const rawContent = fs.readFileSync(path, { encoding: 'utf-8' })

    const { data, content } = matter(rawContent)

    return {
        props: { policy: { data, content } },
    }
}

export default PrivacyPolicy
