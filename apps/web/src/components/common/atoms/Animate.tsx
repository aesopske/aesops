'use client'

import React from 'react'

type AnimateDirection = 'right' | 'left' | 'up' | 'down'

type AnimateProps = {
    dir?: AnimateDirection
    duration?: number
    children: React.ReactNode
    threshold?: number
    respondToScroll?: boolean
    useObserver?: boolean
    initiallyVisible?: boolean
} & React.HTMLAttributes<HTMLDivElement>

function Animate({
    children,
    dir = 'up',
    duration = 0.5,
    threshold = 0.2,
    useObserver = true,
    initiallyVisible = false,
    style,
    ...props
}: AnimateProps) {
    const ref = React.useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = React.useState(initiallyVisible)

    React.useEffect(() => {
        if (!useObserver) {
            setIsVisible(initiallyVisible)
            return
        }
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entries) => { const entry = entries[0]; if (entry?.isIntersecting) { setIsVisible(true); observer.disconnect() } },
            { threshold, rootMargin: '10px' },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [useObserver, initiallyVisible, threshold])

    const translateMap: Record<AnimateDirection, string> = {
        up: 'translateY(40px)',
        down: 'translateY(-40px)',
        left: 'translateX(40px)',
        right: 'translateX(-40px)',
    }

    return (
        <div
            ref={ref}
            style={{
                transition: `opacity ${duration}s ease, transform ${duration}s ease`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0,0)' : translateMap[dir],
                ...style,
            }}
            {...props}>
            {children}
        </div>
    )
}

export default Animate
