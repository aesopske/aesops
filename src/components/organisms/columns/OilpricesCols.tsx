'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import Text from '@src/components/common/atoms/Text'
import { oil_pricesModel } from '@src/types/zod-prisma'
import { z } from 'zod'
import DataTableColumnHeader from '../DataTableColumnHeader'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type oilPriceType = z.infer<typeof oil_pricesModel>

export const oilpricesCols: ColumnDef<oilPriceType>[] = [
    {
        id: 'Month',
        accessorKey: 'Month',
        header: ({ column }) => (
            <DataTableColumnHeader title='Month' column={column} />
        ),
        cell: (props) => {
            const month = props.getValue<string>()
            return <Text className='text-sm'>{month}</Text>
        },
    },
    {
        accessorKey: 'Towns',
        header: ({ column }) => (
            <DataTableColumnHeader title='Towns' column={column} />
        ),
        cell: (props) => {
            const town = props.getValue<string>()
            return <Text className='text-sm'>{town}</Text>
        },
    },
    {
        id: 'County',
        accessorKey: 'County',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='County' />
        ),
        cell: (props) => {
            const county = props.getValue<string>()
            return (
                <Text className='text-xs font-medium uppercase'>{county}</Text>
            )
        },
    },
    {
        id: 'Pms',
        accessorKey: 'Pms',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='PMS (Petrol) (KES)' />
        ),
        cell: (props) => {
            const pmsValue = props.getValue<number>()
            return (
                <Text className='text-xs font-medium uppercase'>
                    {pmsValue ? pmsValue : 0}
                </Text>
            )
        },
    },
    {
        id: 'Ago',
        accessorKey: 'Ago',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='AGO Diesel (KES)' />
        ),
        cell: (props) => {
            const agoValue = props.getValue<number>()
            return (
                <Text className='text-xs font-medium uppercase'>
                    {agoValue ? agoValue : 0}
                </Text>
            )
        },
    },
    {
        id: 'Dpk',
        accessorKey: 'Dpk',

        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='DPK Kerosene (KES)' />
        ),
        cell: (props) => {
            const dpkValue = props.getValue<number>()
            return (
                <Text className='text-xs font-medium uppercase'>
                    {dpkValue ? dpkValue : 0}
                </Text>
            )
        },
    },
    {
        id: 'Ppb',
        accessorKey: 'Ppb',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Price Per Barrel (KES)'
            />
        ),
        cell: (props) => {
            const ppbValue = props.getValue<number>()
            return (
                <Text className='text-xs font-medium uppercase'>
                    {ppbValue ? ppbValue : '-'}
                </Text>
            )
        },
    },
    {
        id: 'Exrates',
        accessorKey: 'Exrates',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title='Exchange Rates (KES)'
            />
        ),
        cell: (props) => {
            const exrate = props.getValue<number>()
            return (
                <Text className='text-xs font-medium uppercase'>
                    {exrate ? exrate : '-'}
                </Text>
            )
        },
    },
    {
        id: 'Date',
        accessorKey: 'Date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: (props) => {
            const date = props.getValue<number>()
            return (
                <Text className='text-xs font-medium uppercase'>
                    {date ? format(new Date(date), 'dd/MM/yyyy') : '-'}
                </Text>
            )
        },
    },
]
