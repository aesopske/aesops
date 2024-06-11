import React from 'react'

import { cn } from '@src/lib/utils'
import { CTA } from '@sanity/utils/types'
import AesopLink from '@/components/common/atoms/AesopLink'

type SanityCtaGroupProps = {
    ctas: CTA[]
} & React.HTMLAttributes<HTMLDivElement>

function SanityCtaGroup({ ctas, className }: SanityCtaGroupProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3 md:flex-row md:items-center md:justify-start md:gap-x-6',
                className,
            )}>
            {ctas?.map((cta) => (
                <>
                    {!cta?.link?.external ? (
                        <AesopLink
                            href={cta?.link?.internal?.slug?.current ?? ''}
                            type='button'
                            variant={cta?.variant ?? ''}>
                            {cta?.label} <span aria-hidden='true'>&rarr;</span>
                        </AesopLink>
                    ) : (
                        <AesopLink
                            isExternal
                            href={cta?.link?.external?.url}
                            variant={cta?.variant ?? ''}>
                            {cta?.label} <span aria-hidden='true'>&rarr;</span>
                        </AesopLink>
                    )}
                </>
            ))}
        </div>
    )
}

export default SanityCtaGroup
