import { useRef, useEffect } from 'react'
import { useParams, useNavigate, Outlet } from 'react-router-dom'
import { setSelectedCategory } from '../../slices/categoriesSlice'
import { useAppSelector, useAppDispatch } from '../../slices/store'
import { getTodosThunk } from '../../slices/todosSlice'
import { CategoryParamsType } from '../types'

export const NavigateCategoryId = () => {
    const prevCategoryIdRef = useRef<string>()

    const { categoryId } = useParams<CategoryParamsType>()
    const categories = useAppSelector(state => state.categories.items)
    const selectedCategory = useAppSelector(state => state.categories.selected)

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (prevCategoryIdRef.current !== categoryId) {
            if (categoryId) {
                const category = categories.find(category => category.id === categoryId)

                if (category) {
                    if (selectedCategory?.id !== category.id) {
                        dispatch(setSelectedCategory(category))
                        dispatch(getTodosThunk(category.id))
                    }

                    prevCategoryIdRef.current = categoryId
                } else {
                    dispatch(setSelectedCategory(null))
                    navigate('/', { replace: true })

                    prevCategoryIdRef.current = undefined
                }
            } else {
                dispatch(setSelectedCategory(null))

                prevCategoryIdRef.current = undefined
            }
        }
    }, [categoryId, selectedCategory, categories, dispatch])

    return <Outlet />
}
