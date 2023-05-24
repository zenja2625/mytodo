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

    const categories = useAppSelector(state => state.categories.items)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const showLoadPage = useLoadDelay(!!todosRequestId, 500)

    const dispatch = useAppDispatch()

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // const selectedCategory = useMemo(
    //     () => categoryId && categories.find(category => category.id === categoryId),
    //     [categoryId, categories]
    // )

    useEffect(() => {
        const foo = async (selectedCategory: Category) => {
            await dispatch(getTodosThunk({ categoryId: selectedCategory.id }))
            setSelectedCategory(selectedCategory)
        }

        const a1 = categoryId && categories.find(category => category.id === categoryId)

        if (a1) foo(a1)
        else if (categoryId) navigate('/', { replace: true })
    }, [categoryId, selectedCategory, navigate])

    return selectedCategory ? (
        <Todos selectedCategory={selectedCategory} />
    ) : (
        <div>Choose Category</div>
    )
}
