import { memo, useMemo } from 'react'
import { ListChildComponentProps, areEqual } from 'react-window'
import { TreeItem, RowProps } from './types'

export const Row = memo(
    <T extends TreeItem>({ index, style, data }: ListChildComponentProps<RowProps<T>>) => {
        const { activeIndex, order, getHandleProps, getItem, getRowStyle } = data

        const id = order[index].id
        const handleProps = useMemo(() => getHandleProps(id), [getHandleProps, id])
        const rowElement = useMemo(() => getItem(index, handleProps), [index, handleProps, getItem])

        if (activeIndex === index) return null

        return <div style={getRowStyle(index, style)}>{rowElement}</div>
    },
    areEqual
)
