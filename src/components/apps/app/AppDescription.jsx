import { Box, Heading } from '@chakra-ui/react'
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
            <Heading fontSize='2xl' mb='1rem'>
                Description
            </Heading>
            <Box fontSize='lg'>
                <MarkdownReader content={app?.description} />
            </Box>
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
