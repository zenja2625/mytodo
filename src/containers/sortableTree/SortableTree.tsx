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
} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { TodoItem } from '../todos/TodoItem'
import Context from 'react-redux/es/components/Context'
import { InnerElementContext, RowProps, TreeItem } from './types'
import { useDnd } from './useDnd'

type SortableTreeProps<T extends TreeItem> = {
    items: Array<T>
    itemDepthWidth?: number
    itemHeight: number
    gap?: number
    maxDepth?: number
    header?: JSX.Element
    footer?: JSX.Element
    renderItem: (item: T) => JSX.Element
    renderOverlay: (item: T) => JSX.Element
    onDrop: (activeId: string, overId: string) => void
}

export const Row = memo(<T extends TreeItem>({ index, style, data, isScrolling }: ListChildComponentProps<RowProps<T>>) => {
    const ref = useRef(0)

    useEffect(() => {
        console.log(`Scroll Change`)
    })

    useLayoutEffect(() => {
        ref.current++
    })

    return <div style={style}>SortableTreeInside{ref.current}</div>
}, areEqual)

const context = createContext('light')
const innerElementInitialValue: InnerElementContext = {
    isDrag: false,
    itemHeight: 0,
    xOffset: 0,
    yOffset: 0,
}
const innerElementContext = createContext(innerElementInitialValue)

const innerElementType: ReactElementType = forwardRef<
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
        5,
        itemDepthWidth
    )

    const getItem = useCallback((index: number) => renderItem(order[index]), [order, renderItem])

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

    const rowData: RowProps<T> = useMemo(() => ({ renderItem }), [renderItem])

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
                                itemCount={items.length}
                                itemSize={itemHeight + gap}
                                itemData={rowData}
                                useIsScrolling={false}
                                overscanCount={30}
                                innerRef={innerRef}
                                
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
