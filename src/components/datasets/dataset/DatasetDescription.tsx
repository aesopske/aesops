import { useState, useEffect } from 'react'
import { Box, Heading } from '@chakra-ui/react'
import { DiscussionEmbed } from 'disqus-react'

import { DATASET } from '@/types'
import MarkdownReader from '@/components/common/MarkdownReader'

type DatasetDescriptionProps = {
    dataset: DATASET
}

function DatasetDescription({ dataset }: DatasetDescriptionProps) {
    const [config, setConfig] = useState({})

    useEffect(() => {
        setConfig({
            url: window.location.href,
            identifier: dataset?._id,
            title: dataset?.title,
        })
    }, [dataset?.body, dataset?._id, dataset?.title])

    return (
        <Box>
            <Heading fontSize='2xl' mb='1rem'>
                Description
            </Heading>
            <Box fontSize='lg'>
                <MarkdownReader content={dataset.description} />
            </Box>
            <Box mt='2rem'>
                <DiscussionEmbed shortname='aesops' config={config} />
            </Box>
        </Box>
    )
}

DatasetDescription.defaultProps = {
    dataset: {},
}

export default DatasetDescription
