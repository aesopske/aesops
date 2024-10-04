'use client'

import qs from 'query-string'
import React from 'react'
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
import useFetch from '@src/hooks/useFetch'
import Heading from '@components/common/atoms/Heading'
import Text from '@components/common/atoms/Text'
import AesLines from '../charts/AesLines'
import AesMultiLines from '../charts/AesMultiLines'
import ListWrapper from '../common/ListWrapper'
import FilterBlock from '../organisms/FilterBlock'

function OilPrices({ endpoint }) {
    return (
        <div className='grid grid-cols-1 xl:grid-cols-5 gap-8'>
            <div className='order-1 col-span-1 xl:order-none xl:col-span-3 flex flex-col gap-10'>
                <MultiLines endpoint={`${endpoint}/townprices`} />
                <Lines1 endpoint={`${endpoint}/townprices`} />
                <Lines1 endpoint={`${endpoint}/average-prices`} />
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
    data: Prediction[]
    type: string
    columns: {
        label: string
        value: string
    }[]
}

function PredictionTable({ endpoint }: { endpoint: string }) {
    const { data, error, loading } = useFetch<PredResponse>({ endpoint })

    const currencyFormatter = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 2,
    })

    if (error) {
        return (
            <div className='text-red-600 bg-red-50 p-5 rounded-md space-y-2'>
                <Heading type='h4'>Something went wrong</Heading>
                <Text as='pre'>{JSON.stringify(error, null, 3)}</Text>
            </div>
        )
    }

    if (loading && !data) {
        return (
            <div className='w-full min-h-96 bg-white animate-pulse rounded-md' />
        )
    }

    if (data?.type !== 'table') {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <Heading type='h4'>Prediction Table</Heading>
                <CardDescription>
                    Our prediction for the next 3 months.
                </CardDescription>
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
                                        {(col) => {
                                            const value = item[col.value]

                                            if (
                                                col.value === 'PMS' ||
                                                col.value === 'AGO' ||
                                                col.value === 'DPK'
                                            ) {
                                                return (
                                                    <TableCell>
                                                        {currencyFormatter.format(
                                                            value,
                                                        )}
                                                    </TableCell>
                                                )
                                            }
                                            return (
                                                <TableCell>
                                                    {item[col.value]}
                                                </TableCell>
                                            )
                                        }}
                                    </ListWrapper>
                                </TableRow>
                            )}
                        </ListWrapper>
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Text className='text-sm text-center w-full text-gray-400'>
                    Predictions based on Aesops models
                </Text>
            </CardFooter>
        </Card>
    )
}

const generateConfig = (colums: string[]) => {
    const colors = [
        'hsl(var(--aeschart-2))',
        'hsl(var(--aeschart-3))',
        'hsl(var(--aeschart-6))',
        'hsl(var(--aeschart-7))',
        'hsl(var(--aeschart-8))',
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
    data: any[]
    columns: string[]
    filters: {
        label: string
        type: string
        initialValue?: string
        data: { label: string; value: string }[]
    }[]
}

function Lines1({ endpoint }: { endpoint: string }) {
    const { data, error, loading, fetch } = useFetch<AVGPRICES_RESPONSE>({
        endpoint,
    })

    if (loading && !data) {
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
            title='Average Prices'
            description='Average Fuel Prices, Exchange Rate, and Price Per Barrel Over Time (KES)'
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
                                        onRefetch={async (data) => {
                                            const queryString = qs.stringify(
                                                {
                                                    [filter?.label]: data,
                                                },
                                                {
                                                    skipNull: true,
                                                    skipEmptyString: true,
                                                },
                                            )

                                            // fetch results from the same endpoint with the new query string
                                            await fetch({
                                                endpoint: `${endpoint}?${queryString}`,
                                            })
                                        }}
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
function MultiLines({ endpoint }: { endpoint: string }) {
    const { data, error, loading, fetch } = useFetch<AVGPRICES_RESPONSE>({
        endpoint,
    })

    if (loading && !data) {
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
        <AesMultiLines
            title='Average Prices'
            description='Average Fuel Prices, Exchange Rate, and Price Per Barrel Over Time (KES)'
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
                                        onRefetch={async (data) => {
                                            const queryString = qs.stringify(
                                                {
                                                    [filter?.label]: data,
                                                },
                                                {
                                                    skipNull: true,
                                                    skipEmptyString: true,
                                                },
                                            )

                                            // fetch results from the same endpoint with the new query string
                                            await fetch({
                                                endpoint: `${endpoint}?${queryString}`,
                                            })
                                        }}
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
