import { useEffect, useRef, useState } from 'react'

export const useLoadDelay = (showLoad: boolean, delayMs: number) => {
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (showLoad) {
            intervalRef.current = setTimeout(() => setShow(true), delayMs)
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current)
            setShow(false)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [showLoad, delayMs])

    return show
}
