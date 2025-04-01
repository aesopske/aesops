'use client'

import { useQuery } from '@tanstack/react-query'
import { Lightbulb, X } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@src/components/ui/card'
import useManageFilterParams from '@src/hooks/useManageFilterParams'
import { invoke } from '@src/lib/invoke'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import AesLines from '../charts/AesLines'
import ErrorHandler from '../common/ErrorHandler'
import ListWrapper from '../common/ListWrapper'
import DDExplain from '../common/organisms/dd-explain/DDExplain'
import FilterBlock from '../organisms/FilterBlock'
import { Button } from '../ui'
import { Separator } from '../ui/separator'

function OilPrices({ endpoint }) {
    return (
        <div className='grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-8'>
            <div className='order-1 col-span-1 xl:order-none xl:col-span-3 flex flex-col gap-4 lg:gap-8'>
                <Lines key='townprices' endpoint={`${endpoint}/townprices`} />
                <Lines
                    key='average-prices'
                    endpoint={`${endpoint}/average-prices`}
                />
            </div>
            <div className='col-span-1 xl:col-span-2 w-full'>
                <PredictionTable endpoint={`${endpoint}/prediction`} />
            </div>
        </div>
    )
}

type Prediction = {
    Month: string
    year: number
    PMS: number
    AGO: number
    DPK: number
}

type PredResponse = {
    title: string
    description: string
    data: Prediction[]
    type: string
    columns: {
        label: string
        value: string
    }[]
}

function PredictionTable({ endpoint }: { endpoint: string }) {
    const { data, error, isRefetching, isLoading } = useQuery({
        queryKey: [endpoint],
        queryFn: async () => {
            const response = await invoke({
                endpoint,
            })

            if (response.error) {
                throw new Error(response.error)
            }

            return response.res as PredResponse
        },
        placeholderData: (prev) => prev,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    if (error) {
        return (
            <div className='text-red-600 bg-red-50 p-5 rounded-md space-y-2'>
                <Heading type='h4'>Something went wrong</Heading>
                <Text as='pre'>{JSON.stringify(error, null, 3)}</Text>
            </div>
        )
    }

    if (isLoading && !data) {
        return (
            <div className='w-full min-h-96 bg-white animate-pulse rounded-md' />
        )
    }

    return (
        <Card className={isRefetching ? 'animate-pulse' : ''}>
            <CardHeader className='px-3 md:px-6'>
                <Heading type='h4'>{data?.title ?? ''}</Heading>
                <CardDescription>{data?.description ?? ''}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3 px-3 md:px-6'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <ListWrapper
                                list={data?.columns ?? []}
                                keyExtractor={(col) => col?.label}>
                                {(item) => (
                                    <TableHead className='uppercase text-bold'>
                                        <Text className='font-semibold text-sm'>
                                            {item.label}
                                        </Text>
                                    </TableHead>
                                )}
                            </ListWrapper>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <ListWrapper
                            list={data?.data ?? []}
                            keyExtractor={(pred) => pred?.Month}>
                            {(item) => (
                                <TableRow>
                                    <ListWrapper
                                        list={data?.columns ?? []}
                                        keyExtractor={(col) => col?.value}>
                                        {(col) => (
                                            <TableCell>
                                                {item[col.value]}
                                            </TableCell>
                                        )}
                                    </ListWrapper>
                                </TableRow>
                            )}
                        </ListWrapper>
                    </TableBody>
                </Table>
            </CardContent>
            <Separator className='mb-4' />
            <CardFooter>
                <Lightbulb className='text-brandaccent-300  mr-2' />
                <Text className='text-sm italic'>
                    Based on Aesops&apos; oil prices prediction model.
                </Text>
            </CardFooter>
        </Card>
    )
}

const generateConfig = (colums: string[]) => {
    const colors = [
        'hsl(var(--aeschart-2))',
        'hsl(var(--aeschart-6))',
        'hsl(var(--aeschart-3))',
        'hsl(var(--aeschart-8))',
        'hsl(var(--aeschart-7))',
        'hsl(var(--aeschart-9))',
    ]

    return colums.reduce((config, field, idx) => {
        config[field] = {
            label: field,
            color: colors[idx % colors.length], // cycle through colors
        }
        return config
    }, {})
}

type AVGPRICES_RESPONSE = {
    type: string
    title: string
    description: string
    data: any[]
    columns: string[]
    XAxisKey: string
    filters: {
        label: string
        type: string
        initialValue?: string
        placeholder?: string
        data: { label: string; value: string }[]
    }[]
    filterPrefix?: string
}

function Lines({
    endpoint,
    usesParams = true,
}: {
    endpoint: string
    usesParams?: boolean
}) {
    const [filterPrefix, setFilterPrefix] = useState('')

    const { params, cleanedParams, resetFilters } =
        useManageFilterParams(filterPrefix)

    // filter out params based on the filter key
    const { data, error, isRefetching, isLoading } = useQuery({
        queryKey: [endpoint, params],
        queryFn: async () => {
            const response = await invoke({
                endpoint:
                    usesParams && params ? `${endpoint}?${params}` : endpoint,
            })

            if (response.error) {
                throw new Error(response.error)
            }

            return response.res as AVGPRICES_RESPONSE
        },

        placeholderData: (prev) => prev,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (data?.filterPrefix) {
            setFilterPrefix(data.filterPrefix)
        }
    }, [data?.filterPrefix])

    // refetch once we get the prefix and the params are not undefined only when the page is refreshed

    if (isLoading && !data) {
        return (
            <div className='w-full min-h-96 bg-white animate-pulse rounded-md' />
        )
    }

    if (error) {
        return (
            <div className='text-red-600 bg-red-50 p-5 rounded-md space-y-2'>
                <Heading type='h4'>Something went wrong</Heading>
                <Text as='pre'>{JSON.stringify(error, null, 3)}</Text>
            </div>
        )
    }

    const config = generateConfig(data?.columns ?? [])
    return (
        <AesLines
            config={config}
            title={data?.title ?? ''}
            XAxisKey={data?.XAxisKey ?? ''}
            description={data?.description ?? ''}
            className={isRefetching ? 'animate-pulse' : ''}
            data={data?.data ?? []}
            renderFilters={
                data?.filters ? (
                    <div className='w-full mb-4 py-2 flex gap-2 items-start flex-wrap'>
                        <ListWrapper
                            list={data?.filters}
                            keyExtractor={(filter) => filter?.label}>
                            {(filter) => (
                                <div className='flex items-center gap-4'>
                                    <FilterBlock
                                        type={filter.type}
                                        data={filter.data}
                                        initialValue={filter.initialValue}
                                        selectProps={{
                                            label: filter.label,
                                            placeholder:
                                                filter?.placeholder ?? null,
                                            filterPrefix:
                                                data?.filterPrefix ?? null,
                                        }}
                                    />
                                </div>
                            )}
                        </ListWrapper>

                        {cleanedParams && (
                            <Button
                                className='h-8 bg-brandaccent-50/60 text-semibold text-black hover:bg-brandaccent-50/90'
                                onClick={resetFilters}>
                                <X className='size-4 mr-1' /> Reset filters
                            </Button>
                        )}
                    </div>
                ) : null
            }
            renderFooter={
                <div className='w-full min-h-9 rounded-xl overflow-hidden'>
                    <ErrorBoundary FallbackComponent={ErrorHandler}>
                        <DDExplain
                            title={data?.title ?? ''}
                            columns={data?.columns ?? []}
                            XAxisKey={data?.XAxisKey ?? ''}
                            description={data?.description ?? ''}
                            data={JSON.stringify(data?.data)}
                        />
                    </ErrorBoundary>
                </div>
            }
        />
    )
}

export default OilPrices
