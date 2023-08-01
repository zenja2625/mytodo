import { useCallback, useEffect, useRef } from 'react'
import { getCoordinates } from '../utils/getCoordinates'
import { Coors } from '../types'

export const useListeners = (
    isActive: boolean,
    onMove: (coors: Coors) => void,
    onEnd?: () => void,
    onCancel?: () => void
) => {
    const touchTargetRef = useRef<EventTarget | null>(null)

    const onMoveEvent = useCallback(
        (e: Event) => {
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

    const onEndEvent = useCallback(() => {
        onEnd?.()
    }, [onEnd])

    const onTouchEnd = useCallback(() => {
        onEnd?.()
        
        if (!touchTargetRef.current) return

        touchTargetRef.current.removeEventListener('touchend', onTouchEnd)
        touchTargetRef.current.removeEventListener('touchmove', onMoveEvent)
        touchTargetRef.current = null
    }, [onEnd, onMoveEvent])

    const onTouchStart = useCallback(
        (event: TouchEvent) => {
            const target = event.target

            if (!(target instanceof EventTarget)) return

            target.addEventListener('touchend', onTouchEnd)
            target.addEventListener('touchmove', onMoveEvent)
            touchTargetRef.current = target
        },
        [onTouchEnd, onMoveEvent]
    )

    useEffect(() => {
        if (isActive) {
            window.addEventListener('mousemove', onMoveEvent)
            window.addEventListener('keydown', onKeyboardEvent)
            window.addEventListener('mouseup', onEndEvent)
            window.addEventListener('touchstart', onTouchStart)
            if (touchTargetRef.current) {
                touchTargetRef.current.addEventListener('touchend', onTouchEnd)
                touchTargetRef.current.addEventListener('touchmove', onMoveEvent)
            }
        }

        return () => {
            window.removeEventListener('mousemove', onMoveEvent)
            window.removeEventListener('keydown', onKeyboardEvent)
            window.removeEventListener('mouseup', onEndEvent)
            window.removeEventListener('touchstart', onTouchStart)
            if (touchTargetRef.current) {
                touchTargetRef.current.removeEventListener('touchend', onTouchEnd)
                touchTargetRef.current.removeEventListener('touchmove', onMoveEvent)
            }
        }
    }, [isActive, onMoveEvent, onKeyboardEvent, onEndEvent, onTouchEnd, onTouchStart])
}
