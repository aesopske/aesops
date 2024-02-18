'use client'

import React, { useState, useEffect } from 'react'

import { Button } from '../ui'
import { Input } from '../ui/input'
import { useRouter } from 'next/router'
import { X, SearchIcon } from 'lucide-react'

function Search({ placeholder, label }) {
    const router = useRouter()
    const pathname = router.pathname
    const { search, category } = router.query as {
        search: string
        category: string
    }
    const [searchterm, setSearchterm] = useState(search || '')

    useEffect(() => {
        if (search) setSearchterm(search)
        if (category) setSearchterm(category)
        if (search && category) setSearchterm(search)
    }, [search, category])

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const inputElement = e.target as HTMLInputElement
        if (inputElement.value) setSearchterm(inputElement.value.toLowerCase())
    }

    const handleClick = () => {
        if (!searchterm) return
        router.push(`/${pathname}?search=${searchterm}`, undefined, {
            shallow: true,
        })
    }

    return (
        <div className='w-full'>
            <label htmlFor='search' className='sr-only'>
                {label}
            </label>
            <div className='flex items-center gap-2'>
                <div className='relative w-full'>
                    <SearchIcon className='h-4 w-4 absolute left-3 top-3' />

                    <Input
                        onChange={handleChange}
                        className='w-full px-10'
                        placeholder={placeholder}
                        value={searchterm}
                    />
                    {searchterm ? (
                        <Button
                            variant='ghost'
                            onClick={() => {
                                setSearchterm('')
                                router.push(pathname, undefined, {
                                    shallow: true,
                                })
                            }}
                            className='absolute right-3 top-0 flex items-center justify-center p-0 hover:bg-transparent'
                            aria-label='clear search'>
                            <X className='h-4 w-4' />
                        </Button>
                    ) : null}
                </div>

                <Button
                    className='w-fit'
                    disabled={!searchterm}
                    onClick={handleClick}>
                    Search
                </Button>
            </div>
        </div>
    )
}

Search.defaultProps = {
    label: '',
    setTerm: () => {},
    term: '',
    placeholder: 'search',
    full: false,
}

export default Search
