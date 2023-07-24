import { memo, useMemo, useRef } from 'react'
import { ListChildComponentProps, areEqual } from 'react-window'
import { TreeItem, RowProps } from './types'

export const Row = <T extends TreeItem>({
    index,
    style,
    data,
}: ListChildComponentProps<RowProps<T>>) => {
    const ref = useRef<HTMLDivElement>(null)

    const { activeIndex, order, getHandleProps, getItem, getRowStyle } = data

    const id = order[index].id
    const handleProps = useMemo(() => getHandleProps(id), [getHandleProps, id])
    const rowElement = getItem(index, handleProps)

    if (activeIndex === index) return null

    return (
        <div ref={ref} style={getRowStyle(index, style)}>
            {rowElement}
        </div>
    )
}
