import { Action, AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { message } from 'antd'
import { loginThunk, userInfoThunk } from './accountSlice'
import { AppType, IState } from './sliceTypes'
import { getCategoriesThunk, setSelectedCategory } from './categoriesSlice'
import { getTodosThunk } from './todosSlice'

const initialState: AppType = {
    initialized: false,
    requestCount: 0,
    siderCollapsed: false,
}

interface RejectedAction extends Action {
    payload: number
    type: string
}

const isRejectedAction = (action: AnyAction): action is RejectedAction =>
    action.type.endsWith('rejected')

const isStartLoading = (action: AnyAction) => action.type.endsWith('pending')

const isEndLoading = (action: AnyAction) =>
    action.type.endsWith('fulfilled') || action.type.endsWith('rejected')

export const initializeApp = createAsyncThunk<void, string | undefined, IState>(
    'app/initializeApp',
    async (categoryId, { dispatch, getState }) => {
        await dispatch(userInfoThunk())

        if (getState().account.isAuth) await dispatch(getCategoriesThunk())
        if (categoryId) {
            const categories = getState().categories.items
            const withCompleted = getState().todos.withCompleted//todo
            const selectedCategory = categories.find(category => category.id === categoryId) || null
            if (selectedCategory) {
                await dispatch(getTodosThunk({ categoryId: selectedCategory.id, withCompleted }))
                dispatch(setSelectedCategory(selectedCategory))
            }
        }
    }
)

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        initialization: state => {
            state.initialized = true
        },
        deinitialization: state => {
            state.initialized = false
        },
        toggleSider: state => {
            state.siderCollapsed = !state.siderCollapsed
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, state => {
            state.initialized = true
            // console.log('Set Initialize')
        })
        builder.addMatcher(isStartLoading, state => {
            state.requestCount++
        })
        builder.addMatcher(isEndLoading, state => {
            state.requestCount--
        })
        builder.addMatcher(isRejectedAction, (state, action) => {
            switch (action.payload) {
                case 404:
                    if (action.type.startsWith(loginThunk.typePrefix))
                        // message.error('Неверный логин или пароль')
                        alert('Неверный логин или пароль')
                    else {
                        // message.error('Ошибка синхронизации')
                        alert('Ошибка синхронизации')
                        state.initialized = false
                    }
                    break
                case 401:
                    break
                case 409:
                    // message.error('Данное имя занято')
                    alert('Данное имя занято')
                    break
                default:
                    // message.error('Ошибка сервера')
                    state.initialized = false
                    alert('Ошибка сервера')
                    break
            }
        })
    },
})

export const { initialization, deinitialization, toggleSider } = appSlice.actions
