import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = {
    icon: LucideIcon
    title: string
    description: string
    href?: string
    stat?: string
    comingSoon?: boolean
}

export function CommunityFeatureCard({ icon: Icon, title, description, href, stat, comingSoon }: Props) {
    const inner = (
        <div
            className={`group relative flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors ${
                comingSoon ? 'opacity-75' : 'hover:border-primary/40'
            }`}>
            <div className='mb-4 flex items-center justify-between'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                    <Icon size={18} />
                </div>
                {comingSoon ? (
                    <span className='rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground'>
                        Coming soon
                    </span>
                ) : (
                    stat && (
                        <span className='font-mono text-xs text-muted-foreground'>{stat}</span>
                    )
                )}
            </div>

            <h3 className='text-base font-semibold text-foreground group-hover:text-primary transition-colors'>
                {title}
            </h3>
            <p className='mt-1.5 flex-1 text-sm text-muted-foreground leading-relaxed'>
                {description}
            </p>

            {!comingSoon && href && (
                <span className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary'>
                    Explore
                    <ArrowRight size={14} className='transition-transform group-hover:translate-x-0.5' />
                </span>
            )}
        </div>
    )

    if (comingSoon || !href) {
        return <div className='cursor-default'>{inner}</div>
    }

    return <Link href={href}>{inner}</Link>
}
