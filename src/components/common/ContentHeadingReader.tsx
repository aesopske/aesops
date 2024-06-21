'use client';

import React from 'react'

import { cn } from '@src/lib/utils'

import parseOutline from '@sanity/utils/parseOutline'

import ListWrapper from './ListWrapper'
import Heading from './atoms/Heading'

type ContentHeadingReaderProps = {
    body: any
} & React.HTMLAttributes<HTMLDivElement>

function ContentHeadingReader({ body, className }: ContentHeadingReaderProps) {
    const outline = body ? parseOutline(body) : []

    if (!outline || outline.length === 0) return null
    return (
        <div className={cn('hidden space-y-3 mb-4 md:block', className)}>
            <Heading type='h4' className='font-semibold capitalize'>
                On this page
            </Heading>

            <hr className='my-4 w-3/4' />
            <Header outline={outline} />
            <hr className='mt-8 mb-4 w-3/4' />
        </div>
    )
}

function Header({ outline }) {
    return (
        <ol className='space-y-2'>
            <ListWrapper list={outline} itemKey='slug'>
                {(heading: any) => (
                    <li
                        data-active={true}
                        className='data-[active=true]:border-l-1 my-0.5 border-brandaccent-50 px-1 first:px-0'>
                        <a
                            href={`#${heading.slug}`}
                            className='text-base  font-sans font-normal capitalize text-brandprimary-900'>
                            {heading?.text}
                        </a>
                        <div className='pl-2 list-decimal space-y-2'>
                            {heading?.subheadings?.length > 0 && (
                                <Header outline={heading.subheadings} />
                            )}
                        </div>
                    </li>
                )}
            </ListWrapper>
        </ol>
    )
}

export default ContentHeadingReader