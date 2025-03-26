'use client'

import { motion, type MotionProps, useInView } from 'framer-motion'
import React from 'react'
import useScrollDirection from '@src/hooks/useScrollDirection'

type AnimateDirection = 'right' | 'left' | 'up' | 'down'

type AnimateProps = {
    dir: AnimateDirection
    duration?: number
    children: React.ReactNode
    threshold?: number
    respondToScroll?: boolean
    useObserver?: boolean
    initiallyVisible?: boolean
} & React.HTMLAttributes<HTMLDivElement> &
    MotionProps

function Animate({
    children,
    dir = 'up',
    duration = 0.5,
    threshold = 0.2,
    respondToScroll = true,
    useObserver = true,
    initiallyVisible = false,
    ...props
}: AnimateProps) {
    const ref = React.useRef(null)
    const isInView = useInView(ref, {
        once: true,
        amount: threshold,
        margin: '10px',
    })

    const scrollDirection = useScrollDirection()

    const getAnimationDirection = (): AnimateDirection => {
        if (!respondToScroll || !scrollDirection) return dir

        // When the scroll direction is up, we want to animate in the opposite direction
        if (scrollDirection === 'up') return dir === 'up' ? 'down' : 'up'
        return dir
    }

    const animationDir = getAnimationDirection()

    const variants = {
        hidden: {
            opacity: 0,
            x: dir === 'left' ? 70 : dir === 'right' ? -70 : 0,
            y: animationDir === 'up' ? 70 : animationDir === 'down' ? -70 : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
        },
    }

    const shouldBeVisible = useObserver ? isInView : initiallyVisible

    return (
        <motion.div
            ref={ref}
            initial='hidden'
            animate={shouldBeVisible ? 'visible' : 'hidden'}
            variants={variants}
            transition={{ duration }}
            {...props}>
            {children}
        </motion.div>
    )
}

export default Animate
