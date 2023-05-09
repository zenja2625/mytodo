import { useCallback, useEffect, useRef } from 'react'
import { getCoordinates } from '../utils/getCoordinates'
import { Coors } from '../types'

export const useListeners = (
    isActive: boolean,
    onMove: (coors: Coors) => void,
    onEnd?: () => void,
    onCancel?: () => void
) => {
    const touchMoveStartRef = useRef(false)
    const touchTargetRef = useRef<EventTarget | null>(null)

    const onMoveEvent = useCallback(
        (e: Event) => {
            e.preventDefault()
            onMove(getCoordinates(e))
        },
        [onMove]
    )

    const onKeyboardEvent = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onCancel) onCancel()
        },
        [onCancel]
    )

    const onEndEvent = useCallback(
        (e: Event) => {
            e.preventDefault()
            onEnd?.()
        },
        [onEnd]
    )
    
    const onTouchStartEvent = useCallback((e: TouchEvent) => {
        if (!touchMoveStartRef.current) touchTargetRef.current = e.target
        else e.stopPropagation()
    }, [])

    useEffect(() => {
        window.addEventListener('touchstart', onTouchStartEvent, { capture: true, passive: false })

        if (isActive) {
            window.addEventListener('mousemove', onMoveEvent)
            window.addEventListener('keydown', onKeyboardEvent)
            window.addEventListener('mouseup', onEndEvent)
            if (touchTargetRef.current) {
                touchMoveStartRef.current = true
                touchTargetRef.current.addEventListener('touchmove', onMoveEvent)
                touchTargetRef.current.addEventListener('touchend', onEndEvent)
            }
        } else {
            touchMoveStartRef.current = false
        }
        return () => {
            window.removeEventListener('mousemove', onMoveEvent)
            window.removeEventListener('touchstart', onTouchStartEvent)
            window.removeEventListener('keydown', onKeyboardEvent)
            window.removeEventListener('mouseup', onEndEvent)
            if (touchTargetRef.current) {
                touchTargetRef.current.removeEventListener('touchmove', onMoveEvent)
                touchTargetRef.current.removeEventListener('touchend', onEndEvent)
            }
        }
    }, [isActive, onMoveEvent, onKeyboardEvent, onTouchStartEvent, onEndEvent])
}
