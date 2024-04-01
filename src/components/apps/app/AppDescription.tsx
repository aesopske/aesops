import { useState, useEffect } from 'react'
import { Box, Heading } from '@chakra-ui/react'
import { DiscussionEmbed } from 'disqus-react'

import { APP } from '@/types'
import MarkdownReader from '@/components/common/MarkdownReader'

type AppDescriptionProps = {
    app: APP
}

function AppDescription({ app }: AppDescriptionProps) {
    const [config, setConfig] = useState<{
        url: string
        identifier: string
        title: string
    }>({
        url: '',
        identifier: '',
        title: '',
    })

    useEffect(() => {
        setConfig({
            url: window.location.href,
            identifier: app?._id,
            title: app?.title,
        })
    }, [app?._id, app?.title])

    if (!app) return null
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

export default AppDescription
