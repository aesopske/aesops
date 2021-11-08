import { Box, Heading, Divider } from '@chakra-ui/react'
import MarkdownReader from '@/src/components/common/MarkdownReader'
import { useState, useEffect } from 'react'
import { DiscussionEmbed } from 'disqus-react'

function AppDescription({ app }) {
    const [config, setConfig] = useState({})

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setConfig({
                url: window.location.href,
                identifier: app?._id,
                title: app?.title,
            })
        }
    }, [app?._id, app?.title])
    return (
        <Box>
            <Heading size='md'>Description</Heading>
            <Divider my='1rem' />
            <MarkdownReader content={app?.description} />
            <Box mt='2rem'>
                <DiscussionEmbed shortname='aesops' config={config} />
            </Box>
        </Box>
    )
}

AppDescription.defaultProps = {
    app: {},
}

export default AppDescription
