import { useEffect, useState } from 'react'

function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState<
        'up' | 'down' | null
    >(null)
    const [prevScrollY, setPrevScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            if (currentScrollY === 0) {
                setScrollDirection(null)
            } else if (currentScrollY > prevScrollY) {
                setScrollDirection('down')
            } else {
                setScrollDirection('up')
            }

            setPrevScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [prevScrollY])
    return scrollDirection
}

export default useScrollDirection
