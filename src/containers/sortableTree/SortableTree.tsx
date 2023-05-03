import { createContext, useEffect, useLayoutEffect, useRef, useState, memo } from 'react'
import {
    FixedSizeList as List,
    ListChildComponentProps,
    ReactElementType,
    areEqual,
} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

type TreeItem = {
    id: string
    depth: number
}

type SortableTreeProps<T extends TreeItem> = {
    items: Array<T>
    itemDepthWidth?: number
    itemHeight: number
    gap?: number
    maxDepth?: number
    renderItem: (item: T) => JSX.Element
    renderOverlay: (item: T) => JSX.Element
    onDrop: (activeId: string, overId: string) => void
}

export const Row = memo(({ index, style, data, isScrolling }: ListChildComponentProps) => {
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

    const getItem = (index: number) => {

    }

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
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height || 0}
                            width={width || 0}
                            itemCount={items.length}
                            itemSize={itemHeight + gap}
                            itemData={5}
                            useIsScrolling={false}
                            overscanCount={30}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </context.Provider>
        </div>
    )
}
