import { Box, Heading, Divider } from '@chakra-ui/react'
import MarkdownReader from '@/src/components/common/MarkdownReader'

import { useState, useEffect } from 'react'
import { DiscussionEmbed } from 'disqus-react'

function DatasetDescription({ dataset }) {
    const [config, setConfig] = useState({})

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setConfig({
                url: window.location.href,
                identifier: dataset?._id,
                title: dataset?.title,
            })
        }
    }, [dataset?.body, dataset?._id, dataset?.title])

    return (
        <Box>
            <Heading size='md'>Description</Heading>
            <Divider my='1rem' />
            <MarkdownReader content={dataset.description} />
            <Box my='2rem'>
                <DiscussionEmbed shortname='aesops' config={config} />
            </Box>
        </Box>
    )
}

DatasetDescription.defaultProps = {
    dataset: {},
}

export default DatasetDescription
