type Props = {
    left: React.ReactNode
    right: React.ReactNode
}

export function DatasetPageLayout({ left, right }: Props) {
    return (
        <div className='mx-auto w-full max-w-6xl px-6 py-10'>
            {/* `contents` on the column wrappers below mobile — so each
                section becomes a direct item of this grid and can be
                reordered independently via `order-*` — collapses back into
                two grouped columns at lg via `lg:block`. */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
                <div className='contents lg:block lg:space-y-8 lg:min-w-0'>
                    {left}
                </div>
                <div className='contents lg:block lg:space-y-8'>{right}</div>
            </div>
        </div>
    )
}
