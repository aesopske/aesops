'use client'

import YouTubePlayer from 'react-player/youtube'
import type { PreviewProps } from 'sanity'
import { Stack, Text } from '@sanity/ui'

function YouTubePreview(props: PreviewProps) {
    const { subtitle: url } = props
    return (
        <Stack padding={2} width='full'>
            {props.renderDefault(props)}
            <div className='mt-2 w-full'>
                {typeof url === 'string' ? (
                    <YouTubePlayer
                        url={url}
                        wrapper={({ children }) => (
                            <div className='h-72 w-full'>{children}</div>
                        )}
                    />
                ) : (
                    <Text>Missing YouTube URL</Text>
                )}
            </div>
        </Stack>
    )
}
export default YouTubePreview
