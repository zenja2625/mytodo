import { TreeItem } from '../types'

export const skipDragItems = <T extends TreeItem>(items: Array<T>, index: number) => {
    for (let i = index + 1; i <= items.length; i++)
        if (i === items.length || items[index].depth >= items[i].depth) {
            const count = i - index - 1

            if (count > 0) {
                const array = [...items]
                array.splice(index + 1, count)
                return array
            }

            break
        }

    return items
}
