'use client'

import { X, Linkedin, Github, Globe } from 'lucide-react'

import { cn } from '@src/lib/utils'
import { SOCIAL } from '@sanity/utils/types'
import { buttonVariants } from '@src/components/ui'

const socialIcons = {
    twitter: <X className='w-full h-full' />,
    linkedin: <Linkedin className='w-full h-full' />,
    github: <Github className='w-full h-full' />,
    website: <Globe className='w-full h-full' />,
}
function Socials({ socials }: { socials: SOCIAL[] }) {
    return (
        <div className='flex items-start gap-2'>
            {socials?.map((social) => {
                const iconKey = Object.keys(socialIcons).find((key) => {
                    return key === social?.name?.toLowerCase()
                })

                const icon = iconKey ? socialIcons[iconKey] : null
                return (
                    <a
                        title={social.name}
                        href={social.url}
                        key={social._key}
                        target='_blank'
                        className={cn(
                            buttonVariants({
                                variant: 'outline',
                                className:
                                    'rounded-full border border-brandprimary-900/50 text-brandprimary-900 hover:text-brandaccent-50 w-8 h-8 p-1.5 flex items-center justify-center',
                            }),
                        )}
                        rel='noreferrer noopener'>
                        {icon}
                    </a>
                )
            })}
        </div>
    )
}
export default Socials
