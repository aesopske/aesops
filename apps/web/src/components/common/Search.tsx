'use client'

import { X, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui'

function Search({ placeholder, search, label }) {
    const router = useRouter()
    const pathname = usePathname()

    const [searchTerm, setSearchTerm] = useState<string | undefined>(
        search || '',
    )

    // const searchTerm = inputRef.current?.value

    const handleClick = () => {
        if (!searchTerm || searchTerm?.length < 3) return
        const newPathname = `${pathname}?search=${searchTerm}`
        router.replace(newPathname, {
            scroll: false,
        })
    }

    const clearInput = () => {
        if (!searchTerm) return
        setSearchTerm('')
    }

    return (
        <div className='w-full h-full'>
            <label htmlFor='search' className='sr-only'>
                {label}
            </label>
            <div className='flex items-center gap-2 h-full'>
                <div className='relative w-full h-full'>
                    <input
                        name='searchterm'
                        type='text'
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full h-full bg-transparent text-brandprimary-900 font-semibold pl-4 col-span-2 outline-hidden ring-0'
                    />
                    {searchTerm ? (
                        <Button
                            variant='ghost'
                            onClick={() => {
                                router.replace(pathname, { scroll: false })
                                clearInput()
                            }}
                            className='absolute right-3 top-0 flex items-center justify-center p-0 hover:bg-transparent h-full'
                            aria-label='clear search'>
                            <X className='h-5 w-5' />
                        </Button>
                    ) : null}
                </div>

                <Button
                    className='w-fit rounded-lg bg-brandprimary-700 hover:bg-brandprimary-600 text-white font-semibold px-4 py-2'
                    disabled={!searchTerm}
                    onClick={handleClick}>
                    <SearchIcon className='h-5 w-5' />
                </Button>
            </div>
        </div>
    )
}

export default Search
