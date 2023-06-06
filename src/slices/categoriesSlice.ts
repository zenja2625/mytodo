import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import {
    CategoriesType,
    Category,
    IState,
    openCategoryEditorProps,
    RejectValueType,
} from './sliceTypes'

const initialState: CategoriesType = {
    items: [],
    selected: null,
}

type GetCategoriesThunkReturn = {
    categories: Array<Category>
    // selectedCategory: Category | null
}

export const getCategoriesThunk = createAsyncThunk<
    GetCategoriesThunkReturn,
    string | undefined,
    IState & RejectValueType
>('categories/getCategories', async (categoryId, thunkAPI) => {
    try {
        const response = await API.categories.getCategories()
        const categories = response.data as Array<Category>

        const selectedCategory = categories.find(category => category.id === categoryId) || null

        return {
            categories,
            // selectedCategory,
        }
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.status)
    }
})

export const createCategoryThunk = createAsyncThunk<string, string, IState & RejectValueType>(
    'categories/createCategory',
    async (payload, { getState, dispatch, fulfillWithValue, rejectWithValue }) => {
        try {
            const state = getState()
            const categoryIds = state.categories.items.reduce(
                (acc, curr) => ((acc[curr.id] = true), acc),
                {} as { [key: string]: boolean }
            )

            await API.categories.createCategory({ name: payload })

            const response = await API.categories.getCategories()
            const categories = response.data as Array<Category>

            // await thunkAPI.dispatch(getCategoriesThunk())

            for (let i = 0; i < categories.length; i++) {
                const category = categories[i]

                if (categoryIds[category.id] !== true) {
                    if (category.name === payload) {
                        dispatch(setSelectedCategory(category))
                        dispatch(ass(categories))

                        return fulfillWithValue(category.id)
                    }
                    break
                }
            }

            return fulfillWithValue('')
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
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
        setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
            state.selected = action.payload
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(category => category.id === action.payload)
            state.items.splice(index, 1)
        },
        setCategories: (state, action: PayloadAction<string>) => {
            const index = state.items.findIndex(category => category.id === action.payload)
            state.items.splice(index, 1)
        },
        clearSelectedCategory: state => {
            state.selected = null
        },
        ass: (state, action: PayloadAction<Category[]>) => {
            state.items = action.payload
        },
    },
    extraReducers: builder => {
        builder.addCase(getCategoriesThunk.fulfilled, (state, action) => {
            state.items = action.payload.categories
            // state.selected = action.payload.selectedCategory
        })
        builder.addCase(updateCategoryThunk.fulfilled, (state, action) => {
            const index = state.items.findIndex(category => category.id === action.payload.id)
            state.items[index].name = action.payload.name
        })
    },
})

export const { deleteCategory, setSelectedCategory, setCategories, clearSelectedCategory, ass } =
    categoriesSlice.actions
