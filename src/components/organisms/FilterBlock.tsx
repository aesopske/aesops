'use client'

import qs from 'query-string'
import React, { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useManageFilterParams from '@src/hooks/useManageFilterParams'
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
    onRefetch?: (data: any, query?: string) => void // eslint-disable-line
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
    placeholder?: string
    filterPrefix?: string
    onRefetch?: (data: string | string[], query?: string) => void // eslint-disable-line
    options: { value: string; label: string }[]
}

function SelectFilter({
    label,
    options,
    onRefetch,
    placeholder,
    initialValue,
    ...rest
}: SelectFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { defaultParams } = useManageFilterParams(rest.filterPrefix)

    const handleSelect = (value: string) => {
        const urlParams = defaultParams
            ? qs.parse(defaultParams.toString())
            : {}
        const paramKey = `${rest.filterPrefix}:${label}`
        const query = qs.stringify({ ...urlParams, [paramKey]: value })
        router.push(pathname + '?' + query, { scroll: false })

        // handle data refetching
        if (onRefetch) onRefetch(value, query)
    }

    return (
        <Select
            value={
                defaultParams.get(`${rest.filterPrefix}:${label}`) ??
                initialValue ??
                ''
            }
            onValueChange={(evt) => handleSelect(evt)}>
            <SelectTrigger className='w-full lg:w-[180px] h-8 shadow-sm rounded-md'>
                <SelectValue
                    className='h-10'
                    placeholder={placeholder ?? `Select ${label}`}
                />
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
    placeholder,
    initialValue,
    ...rest
}: SelectFilterProps) {
    const router = useRouter()
    const pathname = usePathname()

    const { defaultParams, params, cleanedParams } = useManageFilterParams(
        rest.filterPrefix,
    )

    const handleSelect = (value: string[]) => {
        const urlParams = defaultParams.toString()
            ? qs.parse(defaultParams.toString())
            : {}

        const paramKey = `${rest.filterPrefix}:${label}`
        const query = qs.stringify({
            ...urlParams,
            [paramKey]: value,
        })
        router.push(pathname + '?' + query, { scroll: false })

        // handle data refetching
        if (onRefetch) onRefetch(value, query)
    }

    const selectedOptions = useMemo(() => {
        const initialIsArray = Array.isArray(initialValue)
        if (!params && initialValue) {
            return initialIsArray ? initialValue : [initialValue]
        }
        const parsedValues = qs.parse(cleanedParams ?? '')

        if (!parsedValues[label] && initialValue) {
            return initialIsArray ? initialValue : [initialValue]
        }
        if (!parsedValues[label]) return []

        if (Array.isArray(parsedValues[label])) return parsedValues[label]
        return [parsedValues[label]]
    }, [params, initialValue, label, cleanedParams])

    return (
        <MultiSelectDropdown
            options={options}
            value={selectedOptions as string[]}
            onValueChange={(val) => handleSelect(val)}
            renderTrigger={() => (
                <Button
                    variant='outline'
                    className='h-8 w-full lg:w-[180px] shadow-sm rounded-md justify-between border-gray-300/80 px-2 hover:bg-gray-50 hover:text-black space-x-2'>
                    <span>{placeholder ?? `Select ${label}`}</span>
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
