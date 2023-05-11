import { FC, useContext, useState } from 'react'
import { Todo } from '../../slices/sliceTypes'
import {
    createTodoThunk,
    deleteTodoThunk,
    toggleTodoCollapsed,
    toggleTodoProgress,
    updateTodoThunk,
} from '../../slices/todosSlice'
import { useAppDispatch } from '../../slices/store'
import moment from 'moment'
import { appDateFormat, serverDateFormat } from '../../dateFormat'
import { modalContext } from '../ModalContext'
import { TodoEditValue } from './types'
import { DragHandleProps } from '../sortableTree/types'

export const TodoItem: FC<{ item: Todo; categoryId: string; handleProps?: DragHandleProps }> = ({
    item,
    categoryId,
    handleProps,
}) => {
    const { openModal } = useContext(modalContext)

    const dispatch = useAppDispatch()

    const openEditor = (isEdit: boolean, addBefore?: boolean) => {
        openModal({
            onSubmit: async (data: TodoEditValue) => {
                if (categoryId) {
                    data.taskEnd = data.taskEnd ? moment(data.taskEnd, serverDateFormat) : undefined

                    if (isEdit) {
                        await dispatch(
                            updateTodoThunk({
                                categoryId,
                                id: item.id,
                                todoDTO: {
                                    value: data.value,
                                    taskEnd: data.taskEnd,
                                },
                            })
                        )
                    } else {
                        await dispatch(
                            createTodoThunk({
                                categoryId: categoryId,
                                ...data,
                                addBefore,
                                overId: item.id,
                            })
                        )
                    }
                }
            },
            defaultValues: isEdit
                ? {
                      value: item.value,
                      taskEnd: item.taskEnd,
                  }
                : undefined,
            fields: {
                value: {
                    options: {
                        required: true,
                    },
                },
                taskEnd: {
                    inputType: 'date',
                },
            },
        })
    }

    return (
        <div
            style={{
                backgroundColor: 'red',
                height: '100%',
                width: '100%',
                userSelect: 'none',
                display: 'flex',
            }}
        >
            <div
                {...handleProps}
                style={{
                    position: 'absolute',
                    width: '20px',
                    height: '100%',
                    backgroundColor: 'yellowgreen',
                    left: -20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'move',
                }}
            >
                :
            </div>
            {item.showHideButton && (
                <div
                    onClick={() => {
                        dispatch(toggleTodoCollapsed(item.id))
                    }}
                >
                    {item.isOpen ? '🡫' : '>'}
                </div>
            )}
            <input
                type='checkbox'
                checked={item.isDone}
                onChange={() => dispatch(toggleTodoProgress(item.id))}
            />
            <div
                style={{
                    padding: '5px',
                    color: 'yellow',
                }}
            >
                {item.id}
            </div>
            <div>
                {item.value} <div>{item.taskEnd?.format(appDateFormat)}</div>
            </div>
            {
                <>
                    <button
                        onClick={() => {
                            openEditor(false, true)
                        }}
                    >
                        Add Up
                    </button>
                    <button
                        onClick={() => {
                            openEditor(false)
                        }}
                    >
                        Add Bottom
                    </button>
                    <button
                        onClick={() => {
                            openEditor(true)
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={async () => {
                            dispatch(deleteTodoThunk({ categoryId, id: item.id }))
                        }}
                    >
                        Delete
                    </button>
                </>
            }
        </div>
    )
}
