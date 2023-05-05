import React, { useCallback, useMemo, useState } from 'react'
import { getCoordinates } from './getCoordinates'
import { getLimitValue } from './getLimitValue'
import { skipDragItems } from './skipDragItems'
import { Coors, TreeItem } from './types'
import { useListeners } from './useListeners'

export const useDnd = <T extends TreeItem>(
    height: number,
    gap: number,
    wrapper: HTMLElement | null,
    items: Array<T>,
    maxDepth: number,
    depthWidth: number
) => {
    const [activeIndex, setActiveIndex] = useState(-1)
    const [overIndex, setOverIndex] = useState(-1)
    const [depth, setDepth] = useState(0)
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 })

    const shift = useMemo((): Coors => {
        const { x = 0, y = 0 } = wrapper?.getBoundingClientRect() || {}

        return {
            x: initialPosition.x - x - items[activeIndex].depth * depthWidth,
            y: initialPosition.y - y - (height + gap) * activeIndex,
        }
    }, [initialPosition, activeIndex, items, depthWidth, wrapper, height, gap])

    const order = useMemo(
        () => (activeIndex !== -1 ? items : skipDragItems(items, activeIndex)),
        [items, activeIndex]
    )
    const onMove = useCallback(
        ({ x, y }: Coors) => {
            const { x: dx = 0, y: dy = 0 } = wrapper?.getBoundingClientRect() || {}

            const offsetY = y - dy - shift.y
            const index = getLimitValue(
                offsetY / (height + gap) - overIndex,
                overIndex,
                0.5 - gap / (height + gap) / 2,
                items.length - 1
            )

            const prevIndex = activeIndex >= index ? index - 1 : index
            const nextIndex = activeIndex <= index ? index + 1 : index

            const prevDepth = items[prevIndex]?.depth + 1 || 0
            const max = prevDepth > maxDepth ? maxDepth : prevDepth
            const min = items[nextIndex]?.depth || 0

            const offsetX = x - shift.x - dx
            const newDepth = getLimitValue(offsetX / depthWidth - depth, depth, 0.3, max, min)
            setOverIndex(index)
            setDepth(newDepth)
        },
        [wrapper, height, gap, maxDepth, items, shift, depth, activeIndex, overIndex]
    )

    const dragEnd = useCallback(() => {
        document.body.style.cursor = ''
        // appDispath(
        //     moveTodo({
        //         id: items[activeIndex].id,
        //         overId: items[overIndex].id,
        //         actualDepth: depth,
        //     })
        // )
        setActiveIndex(-1)
    }, [depth, activeIndex, overIndex, items])

    useListeners(activeIndex !== -1, onMove, dragEnd)

    const dragStart = useCallback(
        (activeIndex: number, depth: number) => (e: React.MouseEvent | React.TouchEvent) => {
            // console.log(e);

            // e.preventDefault()
            document.body.style.cursor = 'move'
            // document.body.style.scrollBehavior = 'hidden'
            const initialPosition = getCoordinates(e.nativeEvent)
            setActiveIndex(activeIndex)
            setOverIndex(activeIndex)
            setDepth(depth)
            setInitialPosition(initialPosition)
        },
        []
    )

    return { activeIndex, overIndex, depth, order, shift, dragStart }
}
