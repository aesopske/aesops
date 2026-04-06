'use client'

import { Play } from 'lucide-react'
import ReactPlayer from 'react-player'
import Text from '@components/common/atoms/Text'

function YouTubeEmbed({ content }) {
    return (
        <div className='bg-brandaccent-50 rounded-md overflow-hidden'>
            <ReactPlayer
                controls
                url={content.url}
                wrapper={({ children }) => (
                    <div className='h-72 md:h-96'>{children}</div>
                )}
            />
            <Text className='p-2 italic text-brandprimary-900/70 flex items-center gap-2 text-sm'>
                <Play size={16} />
                {content.title}
            </Text>
        </div>
    )
}
export default YouTubeEmbed
