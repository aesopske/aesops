'use client'

import ListWrapper from './ListWrapper'
import Heading from './atoms/Heading'

function ContentHeadingReader({ outline }) {
    if (!outline || outline.length === 0) return null
    return (
        <div className='space-y-3 mb-4'>
            <Heading type='h6' className='capitalize font-semibold'>
                Page Contents
            </Heading>

            <hr className='my-4 w-3/4' />
            <Header outline={outline} />
            <hr className='mt-8 mb-4 w-3/4' />
        </div>
    )
}

function Header({ outline }) {
    return (
        <ol>
            <ListWrapper list={outline} itemKey='slug'>
                {(heading: any) => (
                    <li
                        data-active={true}
                        className='data-[active=true]:border-l-1 my-0.5 border-aes-light px-1 first:px-0'>
                        <a
                            href={`#${heading.slug}`}
                            className='text-sm  font-sans font-normal capitalize text-aes-dark'>
                            {heading?.text}
                        </a>
                        <div className='pl-2 list-decimal'>
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
