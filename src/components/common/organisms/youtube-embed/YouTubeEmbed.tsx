'use client'

import { Play } from 'lucide-react'
import ReactPlayer from 'react-player'

function YouTubeEmbed({ content }) {
    return (
        <div className='bg-aes-light rounded-md overflow-hidden'>
            <ReactPlayer url={content.url} controls />
            <p className='p-2 italic text-aes-dark/70 flex items-center gap-2'>
                <Play size={16} />
                {content.title}
            </p>
        </div>
    )
}
export default YouTubeEmbed
