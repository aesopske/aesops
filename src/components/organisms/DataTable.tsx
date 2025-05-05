'use client'

import {
    ColumnDef,
    flexRender,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import ListWrapper from '../common/ListWrapper'
import Text from '../common/atoms/Text'
import DataTableViewOptions from './DataTableViewOptions'

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    renderCaption?: () => React.ReactNode
    renderEmptyState?: () => React.ReactNode
}

function DataTable<TData, TValue>({
    data,
    columns,
    renderCaption,
    renderEmptyState,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: 'onChange',
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className='space-y-4'>
            <DataTableViewOptions table={table} label='Colums to view' />
            <Table className='rounded overflow-x-auto'>
                {table.getRowModel().rows.length > 0 && (
                    <TableCaption>{renderCaption?.()}</TableCaption>
                )}
                <TableHeader className='bg-brandaccent-50/40'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className='border-b-2 border-dashed'>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className='whitespace-nowrap uppercase font-sans text-sm font-normal'>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className='h-12 border-b-2 border-dashed'>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className='border-x-2 first:border-l-0 last:border-r-0 border-dashed'>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className='h-24 text-center'>
                                {renderEmptyState ? (
                                    renderEmptyState()
                                ) : (
                                    <Text className='text-sm text-muted-foreground'>
                                        No data available
                                    </Text>
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

                {table.getRowModel().rows?.length ? (
                    <TableFooter className='bg-transparent border-t-0 h-20'>
                        <TableRow>
                            <TableCell
                                colSpan={Math.floor(
                                    table.getAllColumns().length / 2,
                                )}>
                                <div className='flex items-center gap-x-3 w-full'>
                                    <Select
                                        // disabled={!table.getCanNextPage()}
                                        value={table
                                            .getState()
                                            .pagination.pageSize.toString()}
                                        onValueChange={(value) => {
                                            table.setPageSize(Number(value))
                                        }}>
                                        <SelectTrigger className='max-w-[100px] w-full border-dashed border-2'>
                                            <SelectValue placeholder='Per Page' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <ListWrapper
                                                list={[10, 20, 30, 40, 50]}
                                                keyExtractor={(pageSize) =>
                                                    pageSize
                                                }>
                                                {(pageSize) => (
                                                    <SelectItem
                                                        value={pageSize.toString()}>
                                                        {pageSize}
                                                    </SelectItem>
                                                )}
                                            </ListWrapper>
                                        </SelectContent>
                                    </Select>
                                    <Text className='text-sm w-fit'>
                                        Showing{' '}
                                        {table.getRowModel().rows?.length} of{' '}
                                        {data?.length ?? 0} results
                                    </Text>
                                </div>
                            </TableCell>
                            <TableCell
                                colSpan={Math.ceil(
                                    table.getAllColumns().length / 2,
                                )}>
                                <div className='flex items-center justify-end gap-x-2'>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        className='border-dashed border-2'
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}>
                                        <ChevronLeftIcon className='h-4 w-4' />
                                        Previous
                                    </Button>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        className='border-dashed border-2'
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}>
                                        Next
                                        <ChevronRightIcon className='h-4 w-4' />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                ) : null}
            </Table>
        </div>
    )
}

export default DataTable
