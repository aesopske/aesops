'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@repo/ui/components/select'
import { LICENSES } from '@/lib/constants/licenses'

type Props = {
    id?: string
    value: string
    onChange: (value: string) => void
}

export function LicenseSelect({ id, value, onChange }: Props) {
    const selected = LICENSES.find((l) => l.value === value)

    return (
        <div className='space-y-1.5'>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id={id} className='w-full'>
                    <SelectValue placeholder='Select a license' />
                </SelectTrigger>
                <SelectContent>
                    {LICENSES.map((l) => (
                        <SelectItem key={l.value} value={l.value} title={l.hint}>
                            {l.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {selected && (
                <p className='text-xs text-muted-foreground'>{selected.hint}</p>
            )}
        </div>
    )
}
