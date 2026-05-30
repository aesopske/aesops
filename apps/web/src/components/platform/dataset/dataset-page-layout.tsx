type Props = {
    left: React.ReactNode
    right: React.ReactNode
}

export function DatasetPageLayout({ left, right }: Props) {
    return (
        <div className='mx-auto w-full max-w-6xl px-6 py-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
                <div className='space-y-8 min-w-0'>{left}</div>
                <div className='space-y-8'>{right}</div>
            </div>
        </div>
    )
}
