'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useSearchParams } from 'next/navigation'
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
    CardHeader,
} from '@src/components/ui/card'
import { invoke } from '@src/lib/invoke'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import AesLines from '../charts/AesLines'
import ListWrapper from '../common/ListWrapper'
import FilterBlock from '../organisms/FilterBlock'

function OilPrices({ endpoint }) {
    return (
        <div className='grid grid-cols-1 xl:grid-cols-5 gap-8'>
            <div className='order-1 col-span-1 xl:order-none xl:col-span-3 flex flex-col gap-8'>
                <Lines endpoint={`${endpoint}/townprices`} />
                <Lines
                    usesParams={false}
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
            <CardHeader>
                <Heading type='h4'>{data?.title ?? ''}</Heading>
                <CardDescription>{data?.description ?? ''}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
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
    filters: {
        label: string
        type: string
        initialValue?: string
        data: { label: string; value: string }[]
    }[]
}

function Lines({
    endpoint,
    usesParams = true,
}: {
    endpoint: string
    usesParams?: boolean
}) {
    // check of the url has
    const searchParams = useSearchParams()
    const params = usesParams ? searchParams.toString() : ''

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
            title={data?.title ?? ''}
            description={data?.description ?? ''}
            className={isRefetching ? 'animate-pulse' : ''}
            data={data?.data ?? []}
            config={config}
            XAxisKey='Year'
            renderFilters={
                data?.filters ? (
                    <div className='w-full  mb-4 py-2 flex gap-2 items-start'>
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
                                        }}
                                    />
                                </div>
                            )}
                        </ListWrapper>
                    </div>
                ) : null
            }
        />
    )
}

export default OilPrices
