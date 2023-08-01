import { useCallback, useMemo, useRef } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { InnerElementType, innerElementContext, innerElementInitialValue } from './InnerElementType'
import { Row } from './Row'
import { DragHandleProps, InnerElementContext, RowProps, SortableTreeProps, TreeItem } from './types'
import { useDnd } from './hooks/useDnd'
import { Overlay } from './Overlay'
import { TodoItem1 } from '../todos/TodoItem1'
import { createPortal } from 'react-dom'

export const SortableTree = <T extends TreeItem>({
    items,
    itemDepthWidth = 30,
    itemHeight,
    gap = 0,
    maxDepth = 5,
    onDrop,
    renderItem,
    renderOverlay,
    header,
    footer,
}: SortableTreeProps<T>) => {
    const innerRef = useRef<HTMLDivElement>(null)

    const { activeIndex, overIndex, depth, order, shift, initialPosition, dragStart } = useDnd(
        itemHeight,
        gap,
        innerRef.current,
        items,
        maxDepth,
        itemDepthWidth,
        onDrop
    )

    const value: InnerElementContext = useMemo(
        () =>
            Object.assign(
                {
                    header,
                    footer,
                },
                activeIndex !== -1
                    ? {
                          isDrag: true,
                          itemHeight,
                          xOffset: depth * itemDepthWidth,
                          yOffset: overIndex * (itemHeight + gap),
                      }
                    : innerElementInitialValue
            ),
        [activeIndex, overIndex, depth, itemDepthWidth, itemHeight, gap, header, footer]
    )

    const getRowStyle = useCallback(
        (index: number, style: React.CSSProperties) => {
            const rowStyle = {
                ...style,
                left: order[index].depth * itemDepthWidth,
                right: 0,
                width: undefined,
                height: itemHeight,
            }

            if (activeIndex !== -1) {
                rowStyle.top =
                    index > activeIndex && index <= overIndex
                        ? (index - 1) * (itemHeight + gap)
                        : index < activeIndex && index >= overIndex
                        ? (index + 1) * (itemHeight + gap)
                        : style.top
            }

            return rowStyle
        },
        [activeIndex, overIndex, order, itemHeight, gap, itemDepthWidth]
    )

    const getHandleProps = useCallback(
        (id: string) => ({
            onTouchStart: dragStart(id),
            onMouseDown: dragStart(id),
        }),
        [dragStart]
    )
    const getItem = (index: number, handleProps: DragHandleProps) => renderItem(order[index], handleProps)

    const rowData: RowProps<T> = useMemo(
        () => ({ activeIndex, order, getItem, getRowStyle, getHandleProps }),
        [activeIndex, order, getItem, getRowStyle, getHandleProps]
    )

    const setItemKey = useCallback((index: number, data: RowProps<T>) => data.order[index].id, [])

    const overlayWidth = useMemo(() => {
        return innerRef.current && activeIndex !== -1
            ? innerRef.current.getBoundingClientRect().width - order[activeIndex].depth * itemDepthWidth
            : 0
    }, [itemDepthWidth, activeIndex, order])

    return (
        <div
            style={{
                height: '100%',
            }}
        >
            <innerElementContext.Provider value={value}>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height || 0}
                            width={width || 0}
                            itemCount={order.length}
                            itemSize={itemHeight + gap}
                            itemData={rowData}
                            useIsScrolling={false}
                            overscanCount={10}
                            innerElementType={InnerElementType}
                            innerRef={innerRef}
                            itemKey={setItemKey}
                            style={{
                                willChange: 'auto',
                            }}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
                {createPortal(
                    activeIndex !== -1 ? (
                        <Overlay
                            initialPosition={initialPosition}
                            shift={shift}
                            height={itemHeight}
                            width={overlayWidth}
                        >
                            {renderOverlay(order[activeIndex])}
                        </Overlay>
                    ) : null,
                    document.body
                )}
            </innerElementContext.Provider>
        </div>
    )
}
