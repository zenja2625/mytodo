import { FC, useContext, useState } from 'react'
import { Todo } from '../../slices/sliceTypes'
import { createTodoThunk, deleteTodoThunk, updateTodoThunk } from '../../slices/todosSlice'
import { useAppDispatch } from '../../slices/store'
import moment from 'moment'
import { serverDateFormat } from '../../dateFormat'
import { modalContext } from '../ModalContext'
import { TodoEditValue } from './types'

export const TodoItem: FC<{ item: Todo; categoryId: string }> = ({ item, categoryId }) => {
    const [isLoad, setIsLoad] = useState(false)

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
        <div>
            {item.value.toString()}
            {isLoad ? (
                <span> Загрузкака...</span>
            ) : (
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
                            setIsLoad(true)
                            await dispatch(deleteTodoThunk({ categoryId, id: item.id }))
                            setIsLoad(false)
                        }}
                    >
                        Delete
                    </button>
                </>
            )}
        </div>
    )
}
