import { TreeItem } from './types'

export const skipDragItems = <T extends TreeItem>(items: Array<T>, index: number) => {
    const array = [...items]

    for (let i = index + 1; i <= items.length; i++)
        if (i >= items.length || items[index].depth >= items[i].depth)
            array.splice(index, i - index)

    return array
}
