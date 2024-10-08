'use client'

import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import * as React from 'react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ListWrapper from '../ListWrapper'

type Checked = DropdownMenuCheckboxItemProps['checked']

type MultiSelectDropdownProps = {
    value: string[]
    options: {
        label: string
        value: string
    }[]
    onValueChange: (value: string[]) => void // eslint-disable-line no-unused-vars
    renderTrigger: () => React.ReactNode | React.ReactNode[] | null
}

function MultiSelectDropdown({
    value,
    options,
    onValueChange,
    renderTrigger,
}: MultiSelectDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {typeof renderTrigger === 'function'
                    ? renderTrigger()
                    : renderTrigger}
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-auto lg:min-w-48'>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ListWrapper
                    list={options}
                    keyExtractor={(option) => option.label}>
                    {(option) => (
                        <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={value.includes(option.value) as Checked}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    onValueChange([...value, option.value])
                                } else {
                                    onValueChange(
                                        value.filter((v) => v !== option.value),
                                    )
                                }
                            }}>
                            {option.label}
                        </DropdownMenuCheckboxItem>
                    )}
                </ListWrapper>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MultiSelectDropdown
