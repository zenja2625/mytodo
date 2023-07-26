import { useCallback, useEffect, useRef } from 'react'

export const useAutoScroll = (active: boolean, wrapper: HTMLElement | null, offset: number, speed: number = 5) => {
    const directionRef = useRef<-1 | 0 | 1>(0)
    const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!active) directionRef.current = 0
    }, [active])

    const scroll = useCallback(
        (element: Element) => {
            if (directionRef.current !== 0) {
                element.scrollBy(0, directionRef.current * speed)

                timeoutId.current = setTimeout(() => {
                    scroll(element)
                }, 16)
            } else timeoutId.current = null
        },
        [speed]
    )

    const setDirection = useCallback(
        (y: number, height: number) => {
            const parent = wrapper?.offsetParent

            if (!parent) return
            if (parent.scrollHeight === parent.clientHeight) return

            const scrollTop = parent.scrollTop

            const top = wrapper.getBoundingClientRect().y + scrollTop
            const bottom = parent.getBoundingClientRect().bottom

            if (top + offset > y) directionRef.current = -1
            else if (bottom - offset < y + height) directionRef.current = 1
            else directionRef.current = 0

            if (timeoutId.current === null) scroll(parent)
        },
        [wrapper, offset, scroll]
    )

    return setDirection
}
