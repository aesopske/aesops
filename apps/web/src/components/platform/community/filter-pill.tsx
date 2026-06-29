'use client'

type Props = {
    selected: boolean
    onClick: () => void
    children: React.ReactNode
}

export function FilterPill({ selected, onClick, children }: Props) {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-foreground hover:border-primary/40 hover:text-primary'
            }`}>
            {children}
        </button>
    )
}
