import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import { useDebounce } from '../../hooks/useDebounce'
import { TodoPositionDTO, TodoStatusDTO } from '../../api/apiTypes'
import { todoFields } from '../../forms'
import { areEqual } from 'react-window'
import {
    Box,
    Button,
    IconButton,
    Paper,
    Stack,
    ToggleButton,
    Tooltip,
    Typography,
} from '@mui/material'
import { TodoItemContent } from './TodoItemContent'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { ModalForm } from '../form/ModalForm'

type ModalDataType =
    | {
          type: 'create'
          id?: string
          addBefore?: boolean
          defaultValues: PutTodoDTO
      }
    | {
          type: 'edit'
          id: string
          defaultValues: PutTodoDTO
      }

export const Todos = memo(({ selectedCategory }: { selectedCategory: Category }) => {
    const [modalData, setModalData] = useState<ModalDataType | null>(null)

    const withCompleted = useAppSelector(state => state.todos.withCompleted)
    const todos = useAppSelector(getTodos)

    const statuses = useAppSelector(state => state.todos.todoStatusDTOs)
    const positions = useAppSelector(state => state.todos.todoPositionDTOs)

    const dispatch = useAppDispatch()

    // const openModal = useModal(todoFields)

    const openCreateModal = useCallback(
        (overId?: string, addBefore?: boolean) => {
            setModalData({
                type: 'create',
                id: overId,
                addBefore,
                defaultValues: {
                    value: '',
                    taskEnd: undefined,
                },
            })
            // openModal(
            //     async data => {
            //         await dispatch(
            //             createTodoThunk({
            //                 categoryId: selectedCategory.id,
            //                 value: data.value,
            //                 taskEnd: data.taskEnd,
            //                 overId,
            //                 addBefore,
            //             })
            //         )
            //     },
            //     'Create Todo',
            //     'Create'
            // )
        },
        [selectedCategory, dispatch]
    )

    const openUpdateModal = useCallback(
        (id: string, defaultValues?: PutTodoDTO) => {
            setModalData({
                type: 'edit',
                id,
                defaultValues: {
                    value: defaultValues?.value || '',
                    taskEnd: defaultValues?.taskEnd,
                },
            })
        },
        [selectedCategory, dispatch]
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

    useDebounce(statuses, 500, fetchStatuses)
    useDebounce(positions, 500, fetchPositions)

    const onDrop = useCallback(
        (id: string, overId: string, depth: number) => {
            dispatch(moveTodo({ id, overId, depth }))
        },
        [dispatch]
    )

    const header = useMemo(() => {
        return (
            <Stack direction='row' justifyContent='space-between' alignItems='center' height={80}>
                <Typography variant='h5' fontWeight='bold'>
                    {selectedCategory.name}
                </Typography>
                <Tooltip title={withCompleted ? 'Hide' : 'Show'}>
                    <IconButton
                        onClick={() =>
                            dispatch(
                                getTodosThunk({
                                    categoryId: selectedCategory.id,
                                    withCompleted: !withCompleted,
                                })
                            )
                        }
                        color={withCompleted ? 'inherit' : 'default'}
                    >
                        {withCompleted ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </Tooltip>
            </Stack>
        )
    }, [selectedCategory, withCompleted, dispatch])

    const footer = useMemo(
        () => (
            <Button size='large' onClick={() => openCreateModal(todos[todos.length - 1]?.id)}>
                Добавить задачу
            </Button>
        ),
        [todos, openCreateModal]
    )

    return (
        <>
            <SortableTree
                items={todos}
                itemHeight={44}
                gap={1}
                renderItem={(item, handleProps) => (
                    <TodoItem
                        item={item}
                        handleProps={handleProps}
                        categoryId={selectedCategory.id}
                        openEditModal={openUpdateModal}
                        openAddModal={openCreateModal}
                    />
                )}
                renderOverlay={item => (
                    <Box height={44} boxShadow={3}>
                        <TodoItemContent item={item} />
                    </Box>
                )}
                onDrop={onDrop}
                header={header}
                footer={footer}
            />
            <ModalForm
                fields={todoFields}
                isOpen={!!modalData}
                onSubmit={async data => {
                    if (!modalData) return

                    if (modalData.type === 'create') {
                        await dispatch(
                            createTodoThunk({
                                categoryId: selectedCategory.id,
                                value: data.value,
                                taskEnd: data.taskEnd,
                                overId: modalData.id,
                                addBefore: modalData.addBefore,
                            })
                        )
                    } else {
                        await dispatch(
                            updateTodoThunk({
                                categoryId: selectedCategory.id,
                                id: modalData.id,
                                todoDTO: data,
                            })
                        )
                    }
                }}
                setIsOpen={() => setModalData(null)}
                title='Title'
                defaultValues={modalData?.defaultValues}
            />
        </>
    )
}, areEqual)
