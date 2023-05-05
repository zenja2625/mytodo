export type Coors = { x: number; y: number }

export type RowProps<T extends TreeItem> = {
    renderItem: (item: T) => JSX.Element
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
