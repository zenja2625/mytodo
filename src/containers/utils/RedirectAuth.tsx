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
    const prevCategoryIdRef = useRef<string>()

    const navigate = useNavigate()

    const { categoryId } = useParams<CategoryParamsType>()
    const categories = useAppSelector(state => state.categories.items)
    const selectedCategory = useAppSelector(state => state.categories.selected)

    const dispatch = useAppDispatch()

    useEffect(() => {
        console.log('selectedCategory')
    }, [selectedCategory])

    useEffect(() => {
        console.log(categoryId)
    }, [categoryId])

    useEffect(() => {
        console.log('use Effect')
    })

    // useEffect(() => {
    //     if (prevCategoryIdRef.current !== categoryId) {
    //         console.log(`Dispatch ${categoryId}`)

    //         if (categoryId) {
    //             const category = categories.find(category => category.id === categoryId)

    //             if (category) {
    //                 if (selectedCategory?.id !== category.id)
    //                     dispatch(getTodosThunk({ selectedCategory: category }))

    //                 prevCategoryIdRef.current = categoryId
    //             } else {
    //                 dispatch(clearTodos())
    //                 dispatch(clearSelectedCategory())

    //                 prevCategoryIdRef.current = undefined
    //                 navigate('/', { replace: true })
    //             }
    //         } else {
    //             dispatch(clearTodos())
    //             dispatch(clearSelectedCategory())

    //             prevCategoryIdRef.current = categoryId
    //         }
    //     }
    // }, [categoryId, selectedCategory, dispatch, navigate])

    return <Outlet />
}
