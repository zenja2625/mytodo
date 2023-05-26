import {
    Navigate,
    Outlet,
    matchPath,
    useLocation,
    useMatch,
    useNavigate,
    useParams,
} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryParamsType } from '../types'
import { useEffect } from 'react'
import { setSelectedCategory } from '../../slices/categoriesSlice'
import { getTodosThunk } from '../../slices/todosSlice'

export const RedirectAuth = () => {
    const isAuth = useAppSelector(state => state.account.isAuth)
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    console.log('Login')

    return !isAuth ? <Outlet /> : <Navigate to={from} replace />
}

export const SelectedCategory = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const { categoryId } = useParams<CategoryParamsType>()
    const selectedCategory = useAppSelector(state => state.categories.selected)
    const categories = useAppSelector(state => state.categories.items)

    const dispatch = useAppDispatch()

    ////location.state?.from?.pathname

    useEffect(() => {
        if (categoryId !== selectedCategory?.id) {

            const category = categories.find(category => category.id === categoryId)

            if (category)
                dispatch(getTodosThunk({selectedCategory: category}))

        }
    }, [categoryId, categories, selectedCategory])

    

    // useEffect(() => {
    //     if (categoryId !== selectedCategory?.id) {
    //         const prevCategoryId = matchPath(
    //             '/category/:categoryId',
    //             location.state?.from?.pathname || ''
    //         )?.params.categoryId

    //         if (prevCategoryId === selectedCategory?.id) {
    //             //param
    //             console.log('use Param')

    //             const category = categories.find(category => category.id === categoryId)

    //             dispatch(setSelectedCategory(category || null))
    //         } else {
    //             //state
    //             console.log('use State');

    //             navigate(`/category/${selectedCategory?.id}`, { state: { from: location } })
    //         }
    //     }
    // })

    console.log(
        `param ${categoryId} prevParam ${location.state} selected ${selectedCategory?.id}`
    )
    // console.log(
    //     `param ${categoryId} prevParam ${location.state?.from?.pathname} selected ${selectedCategory?.id}`
    // )

    return <Outlet />
}
