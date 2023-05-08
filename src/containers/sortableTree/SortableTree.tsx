import {
    createContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    memo,
    useMemo,
    useCallback,
    forwardRef,
    CSSProperties,
    useContext,
} from 'react'
import {
    FixedSizeList as List,
    ListChildComponentProps,
    ReactElementType,
    areEqual,
    FixedSizeListProps,
} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { TodoItem } from '../todos/TodoItem'
import Context from 'react-redux/es/components/Context'
import {
    DragHandleProps,
    InnerElementContext,
    RowProps,
    SortableTreeProps,
    TreeItem,
} from './types'
import { useDnd } from './useDnd'

export const Row = memo(
    <T extends TreeItem>({ index, style, data }: ListChildComponentProps<RowProps<T>>) => {
        const { activeIndex, order, getHandleProps, getItem, getRowStyle } = data

        const ref = useRef(0)

        const id = order[index].id

        const handleProps = useMemo(() => getHandleProps(id), [getHandleProps, id])

        const rowElement = useMemo(() => getItem(index, handleProps), [index, handleProps, getItem])

        useEffect(() => {
            // console.log(`Scroll Change`)
        })

        useLayoutEffect(() => {
            ref.current++
        })

        if (activeIndex === index) return null

        return (
            <div style={{ ...getRowStyle(index, style), display: 'flex', alignItems: 'center' }}>
                {rowElement}
                <div style={{ position: 'absolute', right: 0 }}>{ref.current} </div>
            </div>
        )
    },
    areEqual
)

const context = createContext('light')
const innerElementInitialValue: InnerElementContext = {
    isDrag: false,
    itemHeight: 0,
    xOffset: 0,
    yOffset: 0,
}
const innerElementContext = createContext(innerElementInitialValue)

const InnerElementType: ReactElementType = forwardRef<
    HTMLDivElement,
    { style: CSSProperties; children: JSX.Element }
>(({ children, ...rest }, ref) => {
    // console.log(rest.style)

    // const { activeIndex, overIndex, activeDepth, itemHeight, gap, depthWidth, header, footer } =
    //     useContext(Context)

    const { isDrag, itemHeight, xOffset, yOffset, footer, header } = useContext(innerElementContext)
    rest = { ...rest, style: { ...rest.style, position: 'relative' } }

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        width: '800px',
                        maxWidth: '800px',
                        margin: '0 45px 0 45px',
                    }}
                >
                    {header}

                    <div ref={ref} {...rest}>
                        {isDrag && (
                            <>
                                <div
                                    style={{
                                        position: 'absolute',
                                        backgroundColor: 'gray',
                                        height: `${itemHeight}px`,
                                        top: `${yOffset}px`,
                                        right: 0,
                                        left: `${xOffset}px`,
                                    }}
                                ></div>
                            </>
                        )}
                        {children}
                    </div>
                    {footer}
                </div>
            </div>
        </>
    )
})

export const SortableTree = <T extends TreeItem>({
    items,
    itemDepthWidth = 30,
    itemHeight,
    gap = 0,
    maxDepth = 5,
    onDrop,
    renderItem,
}: SortableTreeProps<T>) => {
    const [count, setCount] = useState(0)

    const innerRef = useRef<HTMLDivElement>(null)

    const { activeIndex, overIndex, depth, order, shift, dragStart } = useDnd(
        itemHeight,
        gap,
        innerRef.current,
        items,
        maxDepth,
        itemDepthWidth
    )

    const value: InnerElementContext = useMemo(
        () =>
            activeIndex !== -1
                ? {
                      isDrag: true,
                      itemHeight,
                      xOffset: depth * itemDepthWidth,
                      yOffset: overIndex * (itemHeight + gap),
                  }
                : innerElementInitialValue,
        [activeIndex, overIndex, depth, itemDepthWidth, itemHeight, gap]
    )

    const getRowStyle = useCallback(
        (index: number, style: React.CSSProperties) => {
            const rowStyle = {
                ...style,
                left: order[index].depth * itemDepthWidth,
                right: 0,
                width: undefined,
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
    const getItem = useCallback(
        (index: number, handleProps: DragHandleProps) => renderItem(order[index], handleProps),
        [order, renderItem]
    )

    const rowData: RowProps<T> = useMemo(
        () => ({ activeIndex, order, getItem, getRowStyle, getHandleProps }),
        [activeIndex, order, getItem, getRowStyle, getHandleProps]
    )

    const setItemKey = useCallback((index: number, data: RowProps<T>) => data.order[index].id, [])

    return (
        <div
            style={{
                backgroundColor: 'green',
                height: '100%',
            }}
        >
            <button
                style={{
                    position: 'absolute',
                    right: '20%',
                    zIndex: 110000,
                }}
                onClick={() => {
                    setCount(prev => prev + 1)
                }}
            >
                Click {count}
            </button>

            <context.Provider value='asd'>
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
                                overscanCount={30}
                                innerElementType={InnerElementType}
                                innerRef={innerRef}
                                itemKey={setItemKey}
                            >
                                {Row}
                            </List>
                        )}
                    </AutoSizer>
                </innerElementContext.Provider>
            </context.Provider>
        </div>
    )
}
