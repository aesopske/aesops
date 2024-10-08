'use client'

// import { Menu } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import useDisclosure from '@src/hooks/useDisclosure'
import { cn } from '@src/lib/utils'
import parseOutline from '@sanity/utils/parseOutline'
// import { Button } from '../ui/button'
import ListWrapper from './ListWrapper'
import Heading from './atoms/Heading'

type ContentHeadingReaderProps = {
    body: any
} & React.HTMLAttributes<HTMLDivElement>

function ContentHeadingReader({ body, className }: ContentHeadingReaderProps) {
    // const { isOpen, onToggle } = useDisclosure(false)
    const outline = body ? parseOutline(body) : []

    if (!outline || outline.length === 0) return null
    return (
        <div className={cn('hidden space-y-3 mb-4 lg:block', className)}>
            {/* <div className='flex items-center gap-3'>
                <Button
                    onClick={onToggle}
                    variant='dark'
                    size='icon'
                    className='flex items-center space-x-2 text-sm font-sans font-normal rounded-full'>
                    <Menu size={16} />
                </Button>
                <span>On this page</span>
            </div> */}
            <Heading type='h4' className='font-semibold'>
                On this page
            </Heading>

            <hr className='my-4 w-3/4' />
            <Header outline={outline} />
            <hr className='mt-8 mb-4 w-3/4' />
        </div>
    )
}

function Header({ outline }) {
    const pathname = usePathname()
    return (
        <ol className='space-y-1'>
            <ListWrapper list={outline} itemKey='slug'>
                {(heading: any) => (
                    <li
                        data-active={false}
                        className='data-[active=true]:underline data-[active=true]:underline-offset-4 decoration-dotted data-[active=true]:text-brandprimary-700 my-0.5 px-1 first:px-0'>
                        <Link
                            href={{
                                pathname: pathname,
                                hash: heading.slug,
                            }}
                            passHref
                            className='text-sm font-sans font-normal text-brandprimary-900'>
                            {heading?.text}
                        </Link>
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
