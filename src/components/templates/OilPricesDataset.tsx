'use client'

import { Download } from 'lucide-react'
import { api } from '@src/app/_trpc/client'
import { cn } from '@src/lib/utils'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import { Button } from '../ui'
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card'
import DataTable from '../organisms/DataTable'
import { oilpricesCols } from '../organisms/columns/OilpricesCols'

function OilPricesDataset() {
    const { data, isRefetching } = api.oilPrices.getDatasetPreview.useQuery()
    return (
        <div>
            <Card className={cn('p-8', isRefetching ? 'animate-pulse' : '')}>
                <div className='flex items-start justify-between'>
                    <CardHeader className='px-3 md:px-6 w-3/4'>
                        <Heading type='h3'>{data?.title ?? ''}</Heading>
                        <CardDescription>
                            {data?.description ?? ''}
                        </CardDescription>
                    </CardHeader>
                    <Button
                        disabled
                        className='rounded-md bg-black text-brandaccent-50 font-sans'>
                        <Download className='ml-2 size-4' />
                        Download csv
                    </Button>
                </div>
                <CardContent className='space-y-3 px-3'>
                    <DataTable
                        columns={oilpricesCols}
                        data={data?.data ?? []}
                        renderCaption={() => (
                            <Text className='text-sm font-semibold text-muted-foreground'>
                                {data?.description ?? ''}
                            </Text>
                        )}
                        renderEmptyState={() => (
                            <Text className='text-sm font-semibold text-muted-foreground'>
                                No data available
                            </Text>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default OilPricesDataset
