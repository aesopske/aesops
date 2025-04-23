'use client'

import { Check } from 'lucide-react'
import * as React from 'react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@src/lib/utils'

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
        <>
            <Popover>
                <PopoverTrigger>
                    {typeof renderTrigger === 'function'
                        ? renderTrigger()
                        : renderTrigger}
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0' align='start'>
                    <Command>
                        <CommandInput
                            className='font-sans'
                            placeholder='Search...'
                        />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = value.includes(
                                        option.value,
                                    )
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() => {
                                                if (isSelected) {
                                                    onValueChange(
                                                        value.filter(
                                                            (v) =>
                                                                v !==
                                                                option.value,
                                                        ),
                                                    )
                                                } else {
                                                    onValueChange([
                                                        ...value,
                                                        option.value,
                                                    ])
                                                }
                                            }}>
                                            <div
                                                className={cn(
                                                    'mr-2 flex size-5  items-center justify-center rounded border border-gray-400 border-dashed',
                                                    isSelected
                                                        ? 'bg-transparent text-gray-500 p-1'
                                                        : 'opacity-50 [&_svg]:invisible',
                                                )}>
                                                <Check className='size-3' />
                                            </div>
                                            <span className='font-sans'>
                                                {option.label}
                                            </span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}

export default MultiSelectDropdown
