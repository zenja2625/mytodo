import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { TodoPutDTO } from '../api/apiTypes'
// import { getParentIndex } from '../utility/getParentIndex'
// import { getTodoChildCount } from '../utility/getTodoChildCount'
// import { getTodoDepth } from '../utility/getTodoDepth'
// import { getTodoPosition } from '../utility/getTodoPosition'
import { deinitialization } from './appSlice'
import {
    CreateTodoProps,
    IState,
    RejectValueType,
    TodoDTO,
    TodosType,
    OpenTodoEditorProps,
    DragStartType,
    Category,
} from './sliceTypes'
import { getTodoPosition } from './utils/getTodoPosition'
import { getTodoChildrenCount } from './utils/getTodoChildCount'
import { getParentIndex } from './utils/getParentIndex'
import { setSelectedCategory } from './categoriesSlice'

const initialState: TodosType = {
    items: [],
    todoStatusDTOs: [],
    todoPositionDTOs: [],
    todosRequestId: null,
    withCompleted: false,
}

type UpdateTodoProps = {
    id: string
    categoryId: string
    todoDTO: TodoPutDTO
}

type DeleteTodoProps = {
    id: string
    categoryId: string
}

type GetTodosProps = {
    categoryId: string
}

export type MoveTodoProps = {
    id: string
    overId: string
    depth: number
}

export const getTodosThunk = createAsyncThunk<
    { todos: Array<TodoDTO>; withCompleted: boolean },
    { categoryId: string; withCompleted: boolean },
    IState & RejectValueType
>('todos/getTodosThunk', async (payload, { rejectWithValue, dispatch }) => {
    try {
        const response = await API.todos.getTodos(payload.categoryId, payload.withCompleted)

        return { todos: response.data as Array<TodoDTO>, withCompleted: payload.withCompleted }
    } catch (error: any) {
        return rejectWithValue(error.response?.status)
    }
})

export const updatePositionsThunk = createAsyncThunk<void, string, IState & RejectValueType>(
    'todos/updatePositionsThunk',
    async (payload, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState()
            const positions = state.todos.todoPositionDTOs
            if (positions.length) {
                dispatch(clearTodoPositions())
                await API.todos.updatePositions(payload, positions)
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const updateStatusesThunk = createAsyncThunk<void, string, IState & RejectValueType>(
    'todos/updateStatusesThunk',
    async (payload, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState()
            const statuses = state.todos.todoStatusDTOs
            if (statuses.length) {
                dispatch(clearTodoStatuses())
                await API.todos.updateStatuses(payload, statuses)
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const createTodoThunk = createAsyncThunk<void, CreateTodoProps, IState & RejectValueType>(
    'todos/createTodoThunk',
    async (payload, { getState, rejectWithValue, dispatch }) => {
        try {
            const { items, withCompleted } = getState().todos
            const selectedCategory = getState().categories.selected

            if (selectedCategory) {
                await API.todos.createTodo(selectedCategory.id, {
                    value: payload.value,
                    taskEnd: payload.taskEnd,
                    ...getTodoPosition(items, payload.overId, payload.addBefore),
                })
                await dispatch(getTodosThunk({ categoryId: selectedCategory.id, withCompleted }))
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const updateTodoThunk = createAsyncThunk(
    'todos/updateTodoThunk',
    async (payload: UpdateTodoProps, { rejectWithValue }) => {
        try {
            await API.todos.updateTodo(payload.categoryId, payload.id, payload.todoDTO)
            return payload
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const deleteTodoThunk = createAsyncThunk(
    'todos/deleteTodoThunk',
    async (payload: DeleteTodoProps, { dispatch, rejectWithValue }) => {
        try {
            dispatch(deleteTodo(payload.id))
            await API.todos.deleteTodo(payload.categoryId, payload.id)
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        toggleShowCompletedTodos: state => {
            state.withCompleted = !state.withCompleted
        },
        clearTodos: state => {
            state.items = []
        },
        clearTodoStatuses: state => {
            state.todoStatusDTOs = []
        },
        clearTodoPositions: state => {
            state.todoPositionDTOs = []
        },
        removeChecked: (state, action: PayloadAction<string>) => {
            const withCompleted = state.withCompleted

            if (!withCompleted) {
                const todos = state.items

                const index = todos.findIndex(todo => todo.id === action.payload)

                const childrenCount = getTodoChildrenCount(todos, index)
                todos.splice(index, childrenCount + 1)
            }
        },
        toggleTodoProgress: (state, action: PayloadAction<string>) => {
            const todos = state.items
            const withCompleted = state.withCompleted
            const index = todos.findIndex(todo => todo.id === action.payload)

            if (index !== -1) {
                const isDone = !todos[index].isDone

                state.todoStatusDTOs.push({
                    id: todos[index].id,
                    isDone,
                })

                if (isDone) {
                    const childrenCount = getTodoChildrenCount(todos, index)
                    // if (withCompleted) {
                    for (let i = index; i <= index + childrenCount; i++) {
                        todos[i].isDone = true
                    }
                    // }
                    // else {
                    //     todos.splice(index, childrenCount + 1)
                    // }
                } else {
                    todos[index].isDone = false
                    let parentIndex = getParentIndex(todos, index)
                    while (parentIndex !== -1) {
                        todos[parentIndex].isDone = false
                        parentIndex = getParentIndex(todos, parentIndex)
                    }
                }
            }
        },
        toggleTodoCollapsed: (state, action: PayloadAction<string>) => {
            const todos = state.items
            const index = todos.findIndex(todo => todo.id === action.payload)

            if (index !== -1) {
                const isOpen = !todos[index].isOpen

                todos[index].isOpen = isOpen
                state.todoStatusDTOs.push({
                    id: todos[index].id,
                    isOpen,
                })
            }
        },
        moveTodo: (state, action: PayloadAction<MoveTodoProps>) => {
            const todos = state.items
            const { id, overId, depth } = action.payload

            const activeIndex = todos.findIndex(todo => todo.id === id)
            const depthDelta = depth - todos[activeIndex].depth

            if (id === overId && depthDelta === 0) return

            const childrenCount = getTodoChildrenCount(todos, activeIndex)
            const movedElements = todos.splice(activeIndex, childrenCount + 1)

            for (let i = 0; i < movedElements.length; i++) movedElements[i].depth += depthDelta

            if (id === overId) {
                todos.splice(activeIndex, 0, ...movedElements)
            } else {
                const overIndex = todos.findIndex(todo => todo.id === overId)
                todos.splice(
                    overIndex >= activeIndex ? overIndex + 1 : overIndex,
                    0,
                    ...movedElements
                )
            }

            state.todoPositionDTOs.push({
                id: id,
                ...getTodoPosition(todos, id, true),
            })
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            const todoIndex = state.items.findIndex(todo => todo.id === action.payload)
            const count = getTodoChildrenCount(state.items, todoIndex)
            state.items.splice(todoIndex, 1 + count)
        },
        removeTodo: (state, action: PayloadAction<string>) => {
            if (!state.withCompleted) {
                const todoIndex = state.items.findIndex(todo => todo.id === action.payload)
                state.items.splice(todoIndex, 1)
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getTodosThunk.pending, (state, action) => {
                state.todosRequestId = action.meta.requestId
            })
            .addCase(getTodosThunk.rejected, state => {
                state.todosRequestId = null
            })
            .addCase(getTodosThunk.fulfilled, (state, action) => {
                if (state.todosRequestId === action.meta.requestId) {
                    state.items = action.payload.todos
                    state.withCompleted = action.payload.withCompleted
                    state.todosRequestId = null
                }
            })
            .addCase(updateTodoThunk.fulfilled, (state, action) => {
                const todo = state.items.find(todo => todo.id === action.payload.id)
                if (todo) {
                    todo.value = action.payload.todoDTO.value
                    todo.taskEnd = action.payload.todoDTO.taskEnd
                }
            })
    },
})

export const {
    clearTodos,
    toggleTodoProgress,
    toggleTodoCollapsed,
    moveTodo,
    clearTodoPositions,
    clearTodoStatuses,
    deleteTodo,
    toggleShowCompletedTodos,
    removeChecked,
    removeTodo,
} = todosSlice.actions
