import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getCoordinates } from '../utils/getCoordinates'
import { getLimitValue } from '../utils/getLimitValue'
import { skipDragItems } from '../utils/skipDragItems'
import { Coors, TreeItem } from '../types'
import { useListeners } from './useListeners'
import { useAutoScroll } from './useAutoScroll'

export const useDnd = <T extends TreeItem>(
    height: number,
    gap: number,
    wrapper: HTMLElement | null,
    items: Array<T>,
    maxDepth: number,
    depthWidth: number,
    onDrop: (id: string, overId: string, depth: number) => void
) => {
    const itemsRef = useRef(items)

    const [activeIndex, setActiveIndex] = useState(-1)
    const [overIndex, setOverIndex] = useState(-1)
    const [depth, setDepth] = useState(0)
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        itemsRef.current = items
    }, [items])

    const order = useMemo(() => (activeIndex !== -1 ? skipDragItems(items, activeIndex) : items), [items, activeIndex])

    const shift = useMemo((): Coors => {
        const { x = 0, y = 0 } = wrapper?.getBoundingClientRect() || {}

        return activeIndex !== -1
            ? {
                  x: initialPosition.x - x - order[activeIndex].depth * depthWidth,
                  y: initialPosition.y - y - (height + gap) * activeIndex,
              }
            : { x: 0, y: 0 }
    }, [initialPosition, activeIndex, order, depthWidth, wrapper, height, gap])

    const autoScroll = useAutoScroll(activeIndex !== -1, wrapper, 40, 15)

    const onMove = useCallback(
        ({ x, y }: Coors) => {
            autoScroll(y - shift.y, height)
            const { x: dx = 0, y: dy = 0 } = wrapper?.getBoundingClientRect() || {}

            const offsetY = y - dy - shift.y
            const index = getLimitValue(
                offsetY / (height + gap) - overIndex,
                overIndex,
                0.5 - gap / (height + gap) / 2,
                order.length - 1
            )

            const prevIndex = activeIndex >= index ? index - 1 : index
            const nextIndex = activeIndex <= index ? index + 1 : index

            const prevDepth = order[prevIndex]?.depth + 1 || 0
            const max = prevDepth > maxDepth ? maxDepth : prevDepth
            const min = order[nextIndex]?.depth || 0

            const offsetX = x - shift.x - dx
            const newDepth = getLimitValue(offsetX / depthWidth - depth, depth, 0.3, max, min)
            setOverIndex(index)
            setDepth(newDepth)
        },
        [wrapper, height, gap, maxDepth, order, depthWidth, shift, depth, activeIndex, overIndex, autoScroll]
    )

    const dragEnd = useCallback(() => {
        document.body.style.cursor = ''
        onDrop(order[activeIndex].id, order[overIndex].id, depth)

        setActiveIndex(-1)
    }, [order, activeIndex, overIndex, depth, onDrop])

    useListeners(activeIndex !== -1, onMove, dragEnd)

    const dragStart = useCallback(
        (id: string) => (e: React.MouseEvent | React.TouchEvent) => {
            const index = itemsRef.current.findIndex((item) => item.id === id)

            if (index !== -1) {
                const initialPosition = getCoordinates(e.nativeEvent)

                setActiveIndex(index)
                setOverIndex(index)
                setDepth(itemsRef.current[index].depth)
                setInitialPosition(initialPosition)

                document.body.style.cursor = 'move'
            }
        },
        []
    )

    return { activeIndex, overIndex, depth, order, shift, initialPosition, dragStart }
}
