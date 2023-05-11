import { createSelector } from '@reduxjs/toolkit'
import { Todo } from '../slices/sliceTypes'
import { RootState } from '../slices/store'
import { getTodoChildrenCount } from '../slices/utils/getTodoChildCount'

export const getTodos = createSelector(
    (state: RootState) => state.todos.items,
    todos => {
        const newTodos: Array<Todo> = []

        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i]
            const childrenCount = getTodoChildrenCount(todos, i)

            newTodos.push({
                ...todo,
                showHideButton: childrenCount > 0,
            })

            if (!todos[i].isOpen) i += childrenCount
        }

        return newTodos
    }
)
