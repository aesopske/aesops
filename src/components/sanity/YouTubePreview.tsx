'use client'

import type { PreviewProps } from 'sanity'
import { Flex, Text } from '@sanity/ui'
import YouTubePlayer from 'react-player/youtube'

function YouTubePreview(props: PreviewProps) {
    const { title: url } = props
    return (
        <Flex align='center' justify='center' padding={4}>
            {typeof url === 'string' ? (
                <YouTubePlayer url={url} />
            ) : (
                <Text>Missing YouTube URL</Text>
            )}
        </Flex>
    )
}
export default YouTubePreview
