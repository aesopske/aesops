import Link from 'next/link'
import Image from 'next/image'
import { X, Linkedin, Github, Globe } from 'lucide-react'
import { urlForImage } from '~sanity/utils/image'
import { SOCIAL, TEAM } from '~sanity/utils/types'

const SOCIAL_ICONS = {
    twitter: X,
    linkedin: Linkedin,
    github: Github,
    website: Globe,
} as const

function getInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0] ?? '')
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

function TeamMemberCard({ member }: { member: TEAM }) {
    const photoURL = member.image ? urlForImage(member.image) : null
    const initials = getInitials(member.name)
    const primaryRole = member.role?.split('|')[0]?.trim()
    const slug = member.slug?.current
    const socials = (member.socials ?? []).filter((s) => s.url)

    return (
        <div className='relative group flex flex-col bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:-translate-y-1'>
            {/* Stretched link covers the whole card; socials sit above it via z-index */}
            {slug && (
                <Link
                    href={`/about-us/${slug}`}
                    className='absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    aria-label={`View ${member.name}'s profile`}>
                    <span className='sr-only'>{member.name}</span>
                </Link>
            )}

            {/* Image / placeholder */}
            <div className='relative aspect-[4/3] w-full overflow-hidden'>
                {photoURL ? (
                    <Image
                        fill
                        src={photoURL}
                        alt={member.name}
                        className='object-cover object-top transition-transform duration-500 group-hover:scale-105'
                        sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                    />
                ) : (
                    <div className='w-full h-full bg-primary flex items-center justify-center'>
                        <span className='text-primary-foreground text-4xl font-semibold tracking-wide select-none'>
                            {initials}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className='relative z-10 p-4 space-y-3'>
                <div className='space-y-0.5'>
                    <p className='text-lg font-semibold text-foreground leading-snug'>
                        {member.name}
                    </p>
                    {primaryRole ? (
                        <p className='text-sm text-muted-foreground leading-snug truncate'>
                            {primaryRole}
                        </p>
                    ) : (
                        <p className='text-sm text-muted-foreground/60 leading-snug'>
                            Team Member
                        </p>
                    )}
                </div>

                {socials.length > 0 && (
                    <div className='relative z-20 flex items-center gap-1.5'>
                        {socials.map((social: SOCIAL) => {
                            const Icon =
                                SOCIAL_ICONS[
                                    social.name?.toLowerCase() as keyof typeof SOCIAL_ICONS
                                ]
                            if (!Icon) return null
                            return (
                                <a
                                    key={social._key}
                                    href={social.url}
                                    title={social.name}
                                    target='_blank'
                                    rel='noreferrer noopener'
                                    className='flex items-center justify-center size-10 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200'>
                                    <Icon className='size-5' />
                                </a>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default TeamMemberCard
