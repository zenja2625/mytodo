import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { CategoriesType, Category, openCategoryEditorProps } from './sliceTypes'

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

export const createCategoryThunk = createAsyncThunk(
    'categories/createCategory',
    async (payload: string, thunkAPI) => {
        try {
            await API.categories.createCategory({ name: payload })
            thunkAPI.dispatch(getCategoriesThunk())
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
            state.items = state.items.map(x => (x.id === action.payload.id ? action.payload : x))
        })
    },
})

export const { deleteCategory } = categoriesSlice.actions
