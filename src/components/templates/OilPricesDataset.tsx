'use client'

import { Download } from 'lucide-react'
import { api } from '@src/app/_trpc/client'
import { cn } from '@src/lib/utils'
import ListWrapper from '../common/ListWrapper'
import Heading from '../common/atoms/Heading'
import Text from '../common/atoms/Text'
import { Button } from '../ui'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '../ui/card'
import { Separator } from '../ui/separator'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table'

function OilPricesDataset() {
    const { data, isRefetching } = api.oilPrices.getDatasetPreview.useQuery()
    return (
        <div>
            <Card className={cn(isRefetching ? 'animate-pulse' : '')}>
                <CardHeader className='px-3 md:px-6'>
                    <Heading type='h4'>{data?.title ?? ''}</Heading>
                    <CardDescription>{data?.description ?? ''}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-3 px-3 md:px-6'>
                    <Table className='rounded-lg overflow-hidden'>
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
                                keyExtractor={(pred) => pred?.id ?? ''}>
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
                    {/* <Lightbulb className='text-brandaccent-300  mr-2' />
                    <Text className='text-sm italic'>
                        Based on Aesops&apos; oil prices prediction model.
                    </Text>
                    <pre>{JSON.stringify(data, null, 2)}</pre> */}
                    <Button
                        disabled
                        className='rounded-lg bg-black text-brandaccent-50'>
                        Download (coming soon)
                        <Download className='ml-2 size-4' />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default OilPricesDataset
