import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryParamsType } from '../types'
import { Todos } from './Todos'
import { getTodos } from '../../selectors/getTodos'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { getTodosThunk } from '../../slices/todosSlice'
import { Category } from '../../slices/sliceTypes'

export const TodosWrapper = () => {
    const { categoryId } = useParams<CategoryParamsType>()
    const navigate = useNavigate()

    const selectedCategory = useAppSelector(state => state.todos.selectedCategory)
    const categories = useAppSelector(state => state.categories.items)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const showLoadPage = useLoadDelay(!!todosRequestId, 500)

    const dispatch = useAppDispatch()

    //const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // const selectedCategory = useMemo(
    //     () => categoryId && categories.find(category => category.id === categoryId),
    //     [categoryId, categories]
    // )

    useEffect(() => {

        const selectedCategory = categoryId && categories.find(category => category.id === categoryId)

        if (selectedCategory) dispatch(getTodosThunk({ category: selectedCategory }))
        else if (categoryId) navigate('/', { replace: true })
    }, [categoryId, categories, navigate, dispatch])

    return selectedCategory ? (
        <Todos selectedCategory={selectedCategory} />
    ) : (
        <div>Choose Category</div>
    )
}
