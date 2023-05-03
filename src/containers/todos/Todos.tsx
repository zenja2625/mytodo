import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import {
    clearTodos,
    createTodoThunk,
    deleteTodoThunk,
    getTodosThunk,
} from '../../slices/todosSlice'
import { getTodos } from '../../selectors/getTodos'
import { CategoryParamsType } from '../types'
import { toggleShowCompletedTodos } from '../../slices/categoriesSlice'
import { LoadPage } from '../LoadPage'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { modalContext } from '../ModalContext'
import { CreateTodoProps } from '../../slices/sliceTypes'
import moment, { Moment } from 'moment'
import { serverDateFormat } from '../../dateFormat'
import { TodoItem } from './TodoItem'
import { TodoEditValue } from './types'
import { SortableTree } from '../sortableTree/SortableTree'

export const Todos = () => {
    const { categoryId } = useParams<CategoryParamsType>()

    const { openModal } = useContext(modalContext)

    const withCompleted = useAppSelector(state => state.categories.showCompletedTodos)

    const categories = useAppSelector(state => state.categories.items)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const todos = useAppSelector(getTodos)
    const dispatch = useAppDispatch()

    const showLoadPage = useLoadDelay(!!todosRequestId, 500)

    const selectedCategory = useMemo(
        () => categories.find(category => category.id === categoryId),
        [categoryId, categories]
    )

    useEffect(() => {
        const categoryId = selectedCategory?.id

        if (categoryId) dispatch(getTodosThunk({ categoryId, withCompleted }))
        else dispatch(clearTodos())
    }, [selectedCategory, withCompleted])

    if (showLoadPage) return <LoadPage />

    if (!selectedCategory) return <div className='todos'>Take Category</div>

    return (
        <div className='todos'>
            <SortableTree
                items={todos}
                itemHeight={40}
                renderItem={() => <div></div>}
                renderOverlay={() => <div></div>}
                onDrop={() => {}}
            />

            {/* {selectedCategory.name}
            <button onClick={() => dispatch(toggleShowCompletedTodos())}>
                {withCompleted.toString()}
            </button>
            {todosRequestId}

            {todos.map(item => (
                <TodoItem key={item.id} item={item} categoryId={selectedCategory.id} />
            ))}

            <button
                onClick={() => {
                    openModal({
                        onSubmit: async (data: TodoEditValue) => {
                            if (categoryId) {
                                data.taskEnd = data.taskEnd
                                    ? moment(data.taskEnd, serverDateFormat)
                                    : undefined

                                await dispatch(
                                    createTodoThunk({ categoryId: selectedCategory.id, ...data })
                                )
                            }
                        },
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
                }}
            >
                Add Item
            </button> */}
        </div>
    )
}
