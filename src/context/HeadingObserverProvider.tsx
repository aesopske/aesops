'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

const HeadingObserverContext = createContext({
    ref: null as React.MutableRefObject<IntersectionObserver | null> | null,
    headingsInView: [] as string[],
})

function HeadingObserverProvider({ children }: { children: React.ReactNode }) {
    // create an intersection observer to track which headings are in view on the page
    // this is used to highlight the current heading in the sidebar
    const [headingsInView, setHeadingsInView] = useState<string[]>([])
    const ref = React.useRef<IntersectionObserver | null>(null)

    // use the ref to keep track of the observer so we can clean it up when the component unmounts

    useEffect(() => {
        ref.current = new IntersectionObserver(
            (entries) => {
                console.log(entries)
                const newHeadingsInView = entries
                    .filter((entry) => entry.isVisible)
                    .map((entry) => entry.target.id)
                setHeadingsInView(newHeadingsInView)
            },
            {
                rootMargin: '0% 0% -90% 0%',
            },
        )

        const headings = Array.from(
            document.querySelectorAll('h2, h3, h4, h5, h6'),
        )
        headings.forEach((heading) => {
            ref.current?.observe(heading)
        })

        return () => {
            ref.current?.disconnect()
        }
    }, [])

    return (
        <HeadingObserverContext.Provider value={{ headingsInView, ref }}>
            {children}
        </HeadingObserverContext.Provider>
    )
}

export function useHeadingObserver() {
    const context = useContext(HeadingObserverContext)
    if (!context) {
        throw new Error(
            'useHeadingObserver must be used within a HeadingObserverProvider',
        )
    }
    return context
}

export default HeadingObserverProvider
