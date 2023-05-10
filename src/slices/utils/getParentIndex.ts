import { TodoDTO } from '../sliceTypes'

export const getParentIndex = (todos: Array<TodoDTO>, index: number) => {
    const depth = todos[index].depth

    for (let i = index - 1; i >= 0; i--) if (todos[i].depth < depth) return i

    return -1
}
