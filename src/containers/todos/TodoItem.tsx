import { FC, useEffect, memo, useState } from 'react'
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
           console.log('useEffect');
           
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
            <div className='todo__wrapper'>
                <svg {...handleProps} className='move' viewBox='0 0 50 100'>
                    <path d='M20,30 A5,5 0 0 1 30,30 A5,5 0 0 1 20,30 Z M20,50 A5,5 0 0 1 30,50 A5,5 0 0 1 20,50 Z M20,70 A5,5 0 0 1 30,70 A5,5 0 0 1 20,70 Z' />
                </svg>

                {showHideButton ? (
                    <div
                        onClick={() => dispatch(toggleTodoCollapsed(id))}
                        className={`arrow ${isOpen ? 'down' : ''}`}
                    ></div>
                ) : (
                    <div className='empty'></div>
                )}

                <div className='item'>
                    <CheckBox size={16} checked={isDone} onChange={() => dispatch(toggleTodoProgress(id))} />
                </div>
                <div className='todo__content'>
                    <div className='todo__value'>{value}</div>
                    {taskEnd && <div className='todo__date'>{taskEnd.format(appDateFormat)}</div>}
                </div>

                <TodoMenu switchEvent={switchEvent} />
            </div>
        )
    },
    (prev, next) => {
        const { item: itemPrev, ...prevProps } = prev
        const { item: itemNext, ...nextProps } = next

        const { taskEnd: taskEndPrev, ...itemPrevProps } = itemPrev
        const { taskEnd: taskEndNext, ...itemNextProps } = itemNext

        const taskEndExist = taskEndPrev && taskEndNext
        const taskEndEqual = taskEndExist ? taskEndPrev.isSame(taskEndNext) : taskEndPrev === taskEndNext

        const isEqual = areEqual(prevProps, nextProps) && areEqual(itemPrevProps, itemNextProps)
            && taskEndEqual

        return isEqual
    }
)
