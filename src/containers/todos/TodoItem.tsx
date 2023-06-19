import { FC, useEffect, useState } from 'react'
import { appDateFormat } from '../../dateFormat'
import { PutTodoDTO, Todo } from '../../slices/sliceTypes'
import { useAppDispatch } from '../../slices/store'
import {
    deleteTodoThunk,
    removeChecked,
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
export const TodoItem: FC<TodoItemProps> = ({
    item,
    categoryId,
    handleProps,
    openEditModal,
    openAddModal,
}) => {
    const dispatch = useAppDispatch()

    const { id, value, taskEnd, isDone, showHideButton, isOpen } = item

    useEffect(() => {
        const timeoutId = isDone && setTimeout(() => dispatch(removeChecked(id)), 200)

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
                <circle cx='25' cy='30' r='5' fill='black' />
                <circle cx='25' cy='50' r='5' fill='black' />
                <circle cx='25' cy='70' r='5' fill='black' />
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
                <CheckBox
                    size={16}
                    checked={isDone}
                    onChange={() => dispatch(toggleTodoProgress(id))}
                />
            </div>
            <div className='todo__content'>
                <div className='todo__value'>{value}</div>
                {taskEnd && <div className='todo__date'>{taskEnd.format(appDateFormat)}</div>}
            </div>

            <TodoMenu switchEvent={switchEvent} />
        </div>
    )
}
