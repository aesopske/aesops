import { TableIcon } from 'lucide-react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

function TableBlock({ content }) {
    const headerRow = content?.table?.rows[0] ?? []
    const rows = content?.table?.rows.slice(1) ?? []
    return (
        <div className='w-full bg-aes-light/40 h-auto rounded-md overflow-hidden'>
            <Table>
                <TableHeader className='w-full bg-aes-light hover:bg-aes-light'>
                    <TableRow className='w-ful hover:bg-aes-light border-none'>
                        {headerRow?.cells.map((cell: string, index: number) => (
                            <TableHead
                                key={index}
                                className='w-fit uppercase text-aes-dark font-semibold'>
                                {cell}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows?.map((item: any) => (
                        <TableRow
                            key={item._key}
                            className='border-b border-aes-light hover:bg-aes-light/50'>
                            {item?.cells.map((cell: any, index: number) => (
                                <TableCell key={index} className='font-medium'>
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption className='relative bg-aes-light text-start  w-full'>
                    <div className='w-full flex items-center p-2 italic'>
                        <TableIcon size={16} className='mr-2' />
                        {content?.caption}
                    </div>
                </TableCaption>
            </Table>
        </div>
    )
}
export default TableBlock
