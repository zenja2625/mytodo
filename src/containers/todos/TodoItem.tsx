import { FC, useEffect, memo } from 'react'
import { areEqual } from 'react-window'
import { appDateFormat } from '../../dateFormat'
import { PutTodoDTO, Todo } from '../../slices/sliceTypes'
import { useAppDispatch } from '../../slices/store'
import {
    deleteTodoThunk,
    removeTodo,
    toggleTodoCollapsed,
    toggleTodoProgress,
} from '../../slices/todosSlice'
import { DragHandleProps } from '../sortableTree/types'
import { CheckBox } from './CheckBox'
import './todoItem.css'
import { MenuKeys, TodoMenu } from './TodoMenu'
import { TodoItemContent } from './TodoItemContent'

type TodoItemProps = {
    item: Todo
    categoryId: string
    handleProps?: DragHandleProps
    openEditModal: (id: string, defaultValues?: PutTodoDTO) => void
    openAddModal: (overId?: string, addBefore?: boolean) => void
}

//#f5f5f5
export const TodoItem: FC<TodoItemProps> = memo(
    ({ item, categoryId, handleProps, openEditModal, openAddModal }) => {
        const { id, value, taskEnd, isDone, showHideButton, isOpen } = item

        useEffect(() => {
            console.log('Todo Item Render')
        })

        const dispatch = useAppDispatch()

        useEffect(() => {
            const timeoutId = isDone && setTimeout(() => dispatch(removeTodo(id)), 300)

            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
            }
        }, [isDone, id, dispatch])

        const switchEvent = (key: MenuKeys) => {
            switch (key) {
                case 'change':
                    openEditModal(id, { value, taskEnd })
                    break
                case 'up':
                    openAddModal(id, true)
                    break
                case 'down':
                    openAddModal(id)
                    break
                case 'remove':
                    const response = window.confirm('Remove this item')
                    if (response) dispatch(deleteTodoThunk({ categoryId, id: id }))
                    break
            }
        }

        return (
            <TodoItemContent
                item={item}
                handleProps={handleProps}
                switchEvent={switchEvent}
                toggleColapsed={() => dispatch(toggleTodoCollapsed(id))}
                toggleProgress={() => dispatch(toggleTodoProgress(id))}
            />
        )
    },
    (prev, next) => {
        const {
            item: { taskEnd: taskEndPrev, ...itemPrev },
            ...prevProps
        } = prev
        const {
            item: { taskEnd: taskEndNext, ...itemNext },
            ...nextProps
        } = next

        const taskEndExist = taskEndPrev && taskEndNext
        const taskEndEqual = taskEndExist
            ? taskEndPrev.isSame(taskEndNext)
            : taskEndPrev === taskEndNext

        const isEqual =
            areEqual(prevProps, nextProps) && areEqual(itemPrev, itemNext) && taskEndEqual

        return isEqual
    }
)
