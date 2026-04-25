import { useEffect, useRef } from 'react'

function useEventListener(
    event: string,
    cb: (e: Event) => void,
    element: Window | HTMLElement | null = typeof window !== 'undefined'
        ? window
        : null,
) {
    const callbackRef = useRef(cb)

    useEffect(() => {
        callbackRef.current = cb
    }, [cb])

    useEffect(() => {
        if (element === null) return
        const handler = (e: Event) => callbackRef.current(e)
        element.addEventListener(event, handler)

        return () => element.removeEventListener(event, handler)
    }, [event, element])
}

export default useEventListener
