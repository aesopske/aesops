import { useEffect, useRef } from 'react'

function useEventListener(
    event,
    cb,
    element = typeof window !== 'undefined' ? window : null
) {
    const callbackRef = useRef(cb)

    useEffect(() => {
        callbackRef.current = cb
    }, [cb])

    useEffect(() => {
        if (element === null) return
        const handler = (e) => callbackRef.current(e)
        element.addEventListener(event, handler)

        return () => element.removeEventListener(event, handler)
    }, [event, element])
}

export default useEventListener
