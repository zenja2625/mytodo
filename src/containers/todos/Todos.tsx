import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import {
    clearTodos,
    createTodoThunk,
    deleteTodoThunk,
    getTodosThunk,
    moveTodo,
    toggleShowCompletedTodos,
    updatePositionsThunk,
    updateStatusesThunk,
    updateTodoThunk,
} from '../../slices/todosSlice'
import { getTodos } from '../../selectors/getTodos'
import { CategoryParamsType } from '../types'
import { LoadPage } from '../LoadPage'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { CreateTodoProps } from '../../slices/sliceTypes'
import moment, { Moment } from 'moment'
import { serverDateFormat } from '../../dateFormat'
import { TodoItem } from './TodoItem'
import { TodoEditValue } from './types'
import { SortableTree } from '../sortableTree/SortableTree'
import { TodoItem1 } from './TodoItem1'
import { useDebounce } from '../../hooks/useDebounce'
import { TodoPositionDTO, TodoStatusDTO } from '../../api/apiTypes'
import { useModal } from '../modal/useModal'
import { todoFields } from '../../forms'

export const Todos = () => {
    const { categoryId } = useParams<CategoryParamsType>()

    const withCompleted = useAppSelector(state => state.todos.withCompleted)

    const categories = useAppSelector(state => state.categories.items)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const statuses = useAppSelector(state => state.todos.todoStatusDTOs)
    const positions = useAppSelector(state => state.todos.todoPositionDTOs)

    const todos = useAppSelector(getTodos)
    const dispatch = useAppDispatch()

    const openModal = useModal(todoFields)

    const selectedCategory = useMemo(
        () => categories.find(category => category.id === categoryId),
        [categoryId, categories]
    )

    const openCreateModal = useCallback(
        (overId: string, addBefore: boolean) => {
            if (selectedCategory) {
                openModal(
                    async data => {
                        dispatch(
                            createTodoThunk({
                                categoryId: selectedCategory.id,
                                value: data.value,
                                overId,
                                addBefore,
                            })
                        )
                    },
                    'Create Todo',
                    'Create'
                )
            }
        },
        [selectedCategory, dispatch, openModal]
    )

    const openUpdateModal = useCallback(
        (id: string) => {
            if (selectedCategory) {
                openModal(
                    async data => {

                        const { taskEnd } = data

                        dispatch(
                            updateTodoThunk({
                                categoryId: selectedCategory.id,
                                id,
                                todoDTO: {
                                    value: data.value,
                                },
                            })
                        )
                    },
                    'Update Todo',
                    'Update'
                )
            }
        },
        [selectedCategory, dispatch, openModal]
    )

    const showLoadPage = useLoadDelay(!!todosRequestId, 500)

    const fetchPositions = useCallback(
        (positions: Array<TodoPositionDTO>) => {
            if (selectedCategory && positions.length)
                dispatch(updatePositionsThunk(selectedCategory.id))
        },
        [selectedCategory, dispatch]
    )

    const fetchStatuses = useCallback(
        (statuses: Array<TodoStatusDTO>) => {
            if (selectedCategory && statuses.length)
                dispatch(updateStatusesThunk(selectedCategory.id))
        },
        [selectedCategory, dispatch]
    )

    useDebounce(statuses, 200, fetchStatuses)
    useDebounce(positions, 200, fetchPositions)

    useEffect(() => {
        const categoryId = selectedCategory?.id

        if (categoryId) dispatch(getTodosThunk({ categoryId, withCompleted }))
        else dispatch(clearTodos())
    }, [selectedCategory, withCompleted])

    const onDrop = useCallback(
        (id: string, overId: string, depth: number) => {
            dispatch(moveTodo({ id, overId, depth }))
        },
        [dispatch]
    )

    const header = useMemo(() => {
        return (
            <div
                style={{
                    backgroundColor: 'skyblue',
                    width: '100%',
                    height: '60px',
                }}
            >
                qqq
                <button onClick={() => dispatch(toggleShowCompletedTodos())}>
                    {withCompleted ? 'Скрыть' : 'Показать'}
                </button>
            </div>
        )
    }, [selectedCategory, withCompleted])

    const footer = useMemo(
        () => (
            <div
                style={{
                    width: '100%',
                    backgroundColor: 'skyblue',
                }}
            >
                <button
                // onClick={() =>
                //     openModal({
                //         onSubmit: async (data: TodoEditValue) => {
                //             if (categoryId) {
                //                 data.taskEnd = data.taskEnd
                //                     ? moment(data.taskEnd, serverDateFormat)
                //                     : undefined

                //                 await dispatch(
                //                     createTodoThunk({
                //                         categoryId,
                //                         ...data,
                //                         overId:
                //                             todos.length > 0
                //                                 ? todos[todos.length - 1].id
                //                                 : undefined,
                //                     })
                //                 )
                //             }
                //         },
                //         fields: todoFields,
                //     })
                // }
                >
                    New
                </button>
            </div>
        ),
        []
    )

    if (showLoadPage) return <LoadPage />

    if (!selectedCategory) return <div className='todos'>Take Category</div>

    return (
        <div className='todos'>
            <SortableTree
                items={todos}
                itemHeight={44}
                gap={10}
                renderItem={(item, handleProps) => (
                    <TodoItem
                        item={item}
                        handleProps={handleProps}
                        categoryId={selectedCategory.id}
                    />
                )}
                renderOverlay={item => <TodoItem1 item={item} />}
                onDrop={onDrop}
                header={header}
                footer={footer}
            />
        </div>
    )
}
