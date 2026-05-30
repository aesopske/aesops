'use client'

type Props = {
    checked: boolean
    onChange: (v: boolean) => void
}

export function Toggle({ checked, onChange }: Props) {
    return (
        <button
            type='button'
            role='switch'
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                checked ? 'bg-primary' : 'bg-muted'
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-card shadow ring-0 transition-transform ${
                    checked ? 'translate-x-4' : 'translate-x-0'
                }`}
            />
        </button>
    )
}
