import React from 'react'
import {
    HoverCardContent,
    HoverCardTrigger,
    HoverCard as HoverCardComponent,
} from '@/components/ui/hover-card'

type HoverCardProps = {
    hideDetails?: boolean
    children: React.ReactNode
    renderTrigger?: () => React.ReactNode
}

function HoverCard({
    children,
    renderTrigger,
    hideDetails = false,
}: HoverCardProps) {
    // If hideDetails is true, render only the trigger
    if (hideDetails && typeof renderTrigger === 'function') {
        return renderTrigger()
    }
    return (
        <HoverCardComponent>
            <HoverCardTrigger>
                {renderTrigger ? renderTrigger() : null}
            </HoverCardTrigger>
            <HoverCardContent className='bg-brand-background'>
                {children}
            </HoverCardContent>
        </HoverCardComponent>
    )
}

export default HoverCard
