'use client'

type Props = {
    active?: boolean
    title: string
    onClick: () => void
    children: React.ReactNode
}

export function ToolbarBtn({ active, title, onClick, children }: Props) {
    return (
        <button
            type='button'
            title={title}
            onClick={onClick}
            className={`rounded p-1 transition-colors hover:bg-muted hover:text-foreground ${
                active ? 'bg-muted text-foreground' : 'text-muted-foreground'
            }`}
        >
            {children}
        </button>
    )
}
