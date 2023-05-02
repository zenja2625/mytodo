import { TodoDTO } from '../sliceTypes'

type ReturnTodoPositionType = { parentId?: string; prevTodoId?: string }

export const getTodoPosition = (
    todos: Array<TodoDTO>,
    id?: string,
    addBefore?: boolean
): ReturnTodoPositionType => {
    if (!id)
        return {
            prevTodoId: todos[todos.length - 1]?.id,
        }

    const index = todos.findIndex(todo => todo.id === id)

    const position: ReturnTodoPositionType = {}

    if (addBefore) {
        if (index >= 1 && todos[index - 1].depth === todos[index].depth)
            position.prevTodoId = todos[index - 1].id
    } else {
        position.prevTodoId = id
    }

    for (let i = index - 1; i >= 0; i--) {
        if (todos[i].depth < todos[index].depth) {
            position.parentId = todos[i].id
            break
        }
    }

    return position
}
