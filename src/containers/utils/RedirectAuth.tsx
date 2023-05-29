import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryParamsType } from '../types'
import { useEffect, useMemo, useRef } from 'react'
import { clearSelectedCategory } from '../../slices/categoriesSlice'
import { clearTodos, getTodosThunk } from '../../slices/todosSlice'

export const RedirectAuth = () => {
    const isAuth = useAppSelector(state => state.account.isAuth)
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    console.log('Login')

    return !isAuth ? <Outlet /> : <Navigate to={from} replace />
}

export const useValueChangeEvent = <T,>(changeValue: T, changeEvent: (prev: T) => void) => {
    const ref = useRef<T>(changeValue)

    useEffect(() => {
        if (changeValue !== ref.current) {
            changeEvent(ref.current)
            ref.current = changeValue
        }
    }, [changeValue, changeEvent])
}

export const SelectedCategory = () => {
    const navigate = useNavigate()

    const { categoryId } = useParams<CategoryParamsType>()
    const categories = useAppSelector(state => state.categories.items)
    const selectedCategory = useAppSelector(state => state.categories.selected)

    const dispatch = useAppDispatch()

    const category = useMemo(
        () => (categoryId && categories.find(category => category.id === categoryId)) || null,
        [categoryId, categories]
    )

    useEffect(() => {
        if (categoryId !== selectedCategory?.id) {
            if (category) {
                dispatch(getTodosThunk({ selectedCategory: category }))
            } else {
                if (categoryId) {
                    console.log('');
                    
                    navigate('/', { replace: true })
                }
                else if (selectedCategory) {
                    dispatch(clearTodos())
                    dispatch(clearSelectedCategory())
                }
            }
        }
    }, [categoryId, category, selectedCategory, dispatch, navigate])

    return <Outlet />
}
