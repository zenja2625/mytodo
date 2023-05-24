import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import {
    CategoriesType,
    Category,
    IState,
    openCategoryEditorProps,
    RejectValueType,
} from './sliceTypes'

import { redirect } from 'react-router-dom'

const initialState: CategoriesType = {
    items: [],
}

export const getCategoriesThunk = createAsyncThunk(
    'categories/getCategories',
    async (_, thunkAPI) => {
        try {
            const response = await API.categories.getCategories()
            return response.data as Array<Category>
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const createCategoryThunk = createAsyncThunk<string, string, IState & RejectValueType>(
    'categories/createCategory',
    async (payload: string, thunkAPI) => {
        try {
            let state = thunkAPI.getState()
            const categoryIds = state.categories.items.reduce(
                (acc, curr) => ((acc[curr.id] = true), acc),
                {} as { [key: string]: boolean }
            )

            await API.categories.createCategory({ name: payload })
            await thunkAPI.dispatch(getCategoriesThunk())

            state = thunkAPI.getState()

            for (let i = 0; i < state.categories.items.length; i++) {
                const category = state.categories.items[i]

                if (categoryIds[category.id] !== true) {
                    if (category.name === payload) return thunkAPI.fulfillWithValue(category.id)
                    break
                }
            }

            return thunkAPI.fulfillWithValue('')
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const deleteCategoryThunk = createAsyncThunk(
    'categories/deleteCategoryThunk',
    async (payload: string, { dispatch, rejectWithValue }) => {
        try {
            dispatch(deleteCategory(payload))
            await API.categories.deleteCategory(payload)
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const updateCategoryThunk = createAsyncThunk(
    'categories/updateCategoryThunk',
    async (payload: Category, thunkAPI) => {
        try {
            await API.categories.updateCategory(payload.id, { name: payload.name })
            return payload
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        deleteCategory: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(category => category.id === action.payload)
            state.items.splice(index, 1)
        },
    },
    extraReducers: builder => {
        builder.addCase(getCategoriesThunk.fulfilled, (state, action) => {
            state.items = action.payload
        })
        builder.addCase(updateCategoryThunk.fulfilled, (state, action) => {
            const index = state.items.findIndex(category => category.id === action.payload.id)
            state.items[index].name = action.payload.name
        })
    },
})

export const { deleteCategory } = categoriesSlice.actions
