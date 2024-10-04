'use client'

import qs from 'query-string'
import React, { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import MultiSelectDropdown from '@components/common/molecules/MultiSelectDropdown'
import ListWrapper from '../common/ListWrapper'
import { Button } from '../ui'
import { Badge } from '../ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

interface FilterBlockProps {
    type: string
    initialValue?: string
    data: { value: string; label: string }[]
    selectProps?: any
    onRefetch?: (data: any) => void // eslint-disable-line
}

function FilterBlock({
    type,
    data,
    onRefetch,
    selectProps,
    initialValue,
}: FilterBlockProps) {
    switch (type) {
        case 'select':
            return (
                <SelectFilter
                    options={data}
                    onRefetch={onRefetch}
                    initialValue={initialValue}
                    {...selectProps}
                />
            )
        case 'multi-select':
            return (
                <MultiSelectFilter
                    options={data}
                    onRefetch={onRefetch}
                    initialValue={initialValue}
                    {...selectProps}
                />
            )
        default:
            return null
    }
}

interface SelectFilterProps {
    label: string
    initialValue?: string
    onRefetch?: (data: string | string[]) => void // eslint-disable-line
    options: { value: string; label: string }[]
}

function SelectFilter({
    label,
    options,
    onRefetch,
    initialValue,
}: SelectFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleSelect = (value: string) => {
        const params = searchParams.toString()
            ? qs.parse(searchParams.toString())
            : {}
        const query = qs.stringify({ ...params, [label]: value })
        router.push(pathname + '?' + query, { scroll: false })

        // handle data refetching
        if (onRefetch) onRefetch(value)
    }

    return (
        <Select
            value={searchParams.get(label) ?? initialValue ?? ''}
            onValueChange={(evt) => handleSelect(evt)}>
            <SelectTrigger className='w-[180px] h-8 shadow-sm rounded-md'>
                <SelectValue placeholder={`Select ${label}`} className='h-10' />
            </SelectTrigger>
            <SelectContent>
                <ListWrapper
                    list={options}
                    keyExtractor={(option) => option?.label}>
                    {(option) => (
                        <SelectItem value={option.value}>
                            {option.label}
                        </SelectItem>
                    )}
                </ListWrapper>
            </SelectContent>
        </Select>
    )
}

function MultiSelectFilter({
    label,
    options,
    onRefetch,
    initialValue,
}: SelectFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleSelect = (value: string[]) => {
        const params = searchParams.toString()
            ? qs.parse(searchParams.toString())
            : {}

        const query = qs.stringify({
            ...params,
            [label]: value,
        })
        router.push(pathname + '?' + query, { scroll: false })

        // handle data refetching
        if (onRefetch) onRefetch(value)
    }

    const queryString = searchParams.toString()

    const selectedOptions = useMemo(() => {
        if (!queryString && initialValue) return [initialValue]
        const parsedValues = qs.parse(queryString)

        if (!parsedValues[label] && initialValue) return [initialValue]
        if (!parsedValues[label]) return []

        if (Array.isArray(parsedValues[label])) return parsedValues[label]
        return [parsedValues[label]]
    }, [queryString, initialValue, label])

    return (
        <MultiSelectDropdown
            options={options}
            value={selectedOptions as string[]}
            onValueChange={(val) => handleSelect(val)}
            renderTrigger={() => (
                <Button
                    variant='outline'
                    className='h-8 w-[180px] shadow-sm rounded-md justify-between border-gray-300/80 px-2 hover:bg-gray-50 hover:text-black'>
                    <span>Select {label}</span>
                    {selectedOptions.length > 0 && (
                        <Badge variant='outline'>
                            {selectedOptions.length}
                        </Badge>
                    )}
                </Button>
            )}
        />
    )
}

export default FilterBlock
