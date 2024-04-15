'use client'

import { Play } from 'lucide-react'
import ReactPlayer from 'react-player'
import Text from '@components/common/atoms/Text'

function YouTubeEmbed({ content }) {
    return (
        <div className='bg-aes-light rounded-md overflow-hidden'>
            <ReactPlayer url={content.url} controls />
            <Text className='p-2 italic text-aes-dark/70 flex items-center gap-2 text-sm'>
                <Play size={16} />
                {content.title}
            </Text>
        </div>
    )
}
export default YouTubeEmbed
