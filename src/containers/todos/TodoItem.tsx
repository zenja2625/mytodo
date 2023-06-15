import { FC, useEffect, useState } from 'react'
import { PutTodoDTO, Todo } from '../../slices/sliceTypes'
import {
    deleteTodoThunk,
    removeChecked,
    toggleTodoCollapsed,
    toggleTodoProgress,
} from '../../slices/todosSlice'
import { useAppDispatch } from '../../slices/store'
import { appDateFormat } from '../../dateFormat'
import { DragHandleProps } from '../sortableTree/types'
import { CheckBox } from './CheckBox'

import './todoItem.css'
//#f5f5f5
export const TodoItem: FC<{
    item: Todo
    categoryId: string
    handleProps?: DragHandleProps
    openEditModal: (id: string, defaultValues?: PutTodoDTO) => void
    openAddModal: (overId?: string, addBefore?: boolean) => void
}> = ({ item, categoryId, handleProps, openEditModal, openAddModal }) => {
    const [menuOpen, setMenuOpen] = useState(false)

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

            <div onClick={() => setMenuOpen(prev => !prev)} className='menu__button'>
                <svg style={{ height: '16px' }} viewBox='0 0 100 50'>
                    <circle cx='30' cy='25' r='5' fill='black' />
                    <circle cx='50' cy='25' r='5' fill='black' />
                    <circle cx='70' cy='25' r='5' fill='black' />
                </svg>

                {menuOpen && (
                    <div className='menu__open'>
                        <button
                            onClick={() => {
                                openAddModal(id, true)
                            }}
                        >
                            Add Up
                        </button>
                        <button
                            onClick={() => {
                                openAddModal(id)
                            }}
                        >
                            Add Bottom
                        </button>
                        <button
                            onClick={() => {
                                openEditModal(id, { value, taskEnd })
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                const response = window.confirm('Remove this item')

                                if (response) dispatch(deleteTodoThunk({ categoryId, id: id }))
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
