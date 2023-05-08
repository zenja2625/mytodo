export type Coors = { x: number; y: number }

export type SortableTreeProps<T extends TreeItem> = {
    items: Array<T>
    itemDepthWidth?: number
    itemHeight: number
    gap?: number
    maxDepth?: number
    header?: JSX.Element
    footer?: JSX.Element
    renderItem: (item: T, handleProps: DragHandleProps) => JSX.Element
    renderOverlay: (item: T) => JSX.Element
    onDrop: (activeId: string, overId: string) => void
}

export type DragHandleProps = {
    onTouchStart: (e: React.TouchEvent) => void
    onMouseDown: (e: React.MouseEvent) => void
}

export type RowProps<T extends TreeItem> = {
    getItem: (index: number, handleProps: DragHandleProps) => JSX.Element
    getRowStyle: (index: number, style: React.CSSProperties) => React.CSSProperties
    getHandleProps: (id: string) => DragHandleProps
    activeIndex: number
    order: Array<T>

    // getHandleProps: (index: number) => DragHandleProps
}

export type InnerElementContext = {
    isDrag: boolean
    itemHeight: number
    yOffset: number
    xOffset: number
    header?: JSX.Element
    footer?: JSX.Element
}

export type TreeItem = {
    id: string
    depth: number
}
