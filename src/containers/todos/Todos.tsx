import { FC, memo, useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import {
    createTodoThunk,
    getTodosThunk,
    moveTodo,
    toggleShowCompletedTodos,
    updatePositionsThunk,
    updateStatusesThunk,
    updateTodoThunk,
} from '../../slices/todosSlice'
import { getTodos } from '../../selectors/getTodos'
import { LoadPage } from '../LoadPage'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { Category, PutTodoDTO } from '../../slices/sliceTypes'
import { TodoItem } from './TodoItem'
import { SortableTree } from '../sortableTree/SortableTree'
import { TodoItem1 } from './TodoItem1'
import { useDebounce } from '../../hooks/useDebounce'
import { TodoPositionDTO, TodoStatusDTO } from '../../api/apiTypes'
import { useModal } from '../modal/useModal'
import { todoFields } from '../../forms'
import { areEqual } from 'react-window'

import { CSSTransition, TransitionGroup } from 'react-transition-group'

export const Todos = memo(({ selectedCategory }: { selectedCategory: Category }) => {
    const withCompleted = useAppSelector(state => state.todos.withCompleted)
    const todos = useAppSelector(getTodos)

    const statuses = useAppSelector(state => state.todos.todoStatusDTOs)
    const positions = useAppSelector(state => state.todos.todoPositionDTOs)

    const dispatch = useAppDispatch()

    const openModal = useModal(todoFields)

    const openCreateModal = useCallback(
        (overId?: string, addBefore?: boolean) => {
            openModal(
                async data => {
                    await dispatch(
                        createTodoThunk({
                            categoryId: selectedCategory.id,
                            value: data.value,
                            taskEnd: data.taskEnd,
                            overId,
                            addBefore,
                        })
                    )
                },
                'Create Todo',
                'Create'
            )
        },
        [selectedCategory, dispatch, openModal]
    )

    const openUpdateModal = useCallback(
        (id: string, defaultValues?: PutTodoDTO) => {
            openModal(
                async data => {
                    const { taskEnd, value } = data

                    await dispatch(
                        updateTodoThunk({
                            categoryId: selectedCategory.id,
                            id,
                            todoDTO: {
                                value,
                                taskEnd,
                            },
                        })
                    )
                },
                'Update Todo',
                'Update',
                defaultValues
            )
        },
        [selectedCategory, dispatch, openModal]
    )

    const fetchPositions = useCallback(
        (positions: Array<TodoPositionDTO>) => {
            if (positions.length) dispatch(updatePositionsThunk(selectedCategory.id))
        },
        [selectedCategory, dispatch]
    )

    const fetchStatuses = useCallback(
        (statuses: Array<TodoStatusDTO>) => {
            if (statuses.length) dispatch(updateStatusesThunk(selectedCategory.id))
        },
        [selectedCategory, dispatch]
    )

    useDebounce(statuses, 200, fetchStatuses)
    useDebounce(positions, 200, fetchPositions)

    const onDrop = useCallback(
        (id: string, overId: string, depth: number) => {
            dispatch(moveTodo({ id, overId, depth }))
        },
        [dispatch]
    )

    // useEffect(() => {
    //     console.log('openModal')
    // }, [openModal])
    const header = useMemo(() => {
        return (
            <div
                style={{
                    backgroundColor: 'skyblue',
                    width: '100%',
                    height: '60px',
                }}
            >
                {selectedCategory.name}
                <button
                    onClick={() =>
                        dispatch(
                            getTodosThunk({
                                categoryId: selectedCategory.id,
                                withCompleted: !withCompleted,
                            })
                        )
                    }
                >
                    {withCompleted ? 'Скрыть' : 'Показать'}
                </button>
            </div>
        )
    }, [selectedCategory, withCompleted, dispatch])

    const footer = useMemo(
        () => (
            <div
                style={{
                    width: '100%',
                    backgroundColor: 'skyblue',
                }}
            >
                <button onClick={() => openCreateModal(todos[todos.length - 1]?.id)}>New</button>
            </div>
        ),
        [todos, openCreateModal]
    )

    // if (showLoadPage) return <LoadPage />

    return (
        // <div className='todos'>
        <SortableTree
            items={todos}
            itemHeight={44}
            gap={10}
            renderItem={(item, handleProps) => (
                <TodoItem
                    item={item}
                    handleProps={handleProps}
                    categoryId={selectedCategory.id}
                    openEditModal={openUpdateModal}
                    openAddModal={openCreateModal}
                />
            )}
            renderOverlay={item => <TodoItem1 item={item} />}
            onDrop={onDrop}
            header={header}
            footer={footer}
        />
        // </div>
    )
}, areEqual)
