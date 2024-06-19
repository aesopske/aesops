import AesopLink from '@/components/common/atoms/AesopLink'
import React, { Fragment } from 'react'

import { cn } from '@src/lib/utils'

import { CTA } from '@sanity/utils/types'

import ListWrapper from '../ListWrapper'

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
            <ListWrapper list={ctas} itemKey='label'>
                {(cta: CTA) => (
                    <Fragment>
                        {!cta?.isExternal ? (
                            <AesopLink
                                href={cta?.link ?? ''}
                                type='button'
                                variant={cta?.variant ?? ''}>
                                {cta?.label}{' '}
                                <span aria-hidden='true'>&rarr;</span>
                            </AesopLink>
                        ) : (
                            <AesopLink
                                isExternal
                                type='button'
                                href={cta?.link ?? ''}
                                variant={cta?.variant ?? ''}>
                                {cta?.label}{' '}
                                <span aria-hidden='true'>&rarr;</span>
                            </AesopLink>
                        )}
                    </Fragment>
                )}
            </ListWrapper>
        </div>
    )
}

export default SanityCtaGroup
