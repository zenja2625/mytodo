import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryParamsType } from '../types'
import { Todos } from './Todos'
import { getTodos } from '../../selectors/getTodos'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { getTodosThunk } from '../../slices/todosSlice'
import { Category } from '../../slices/sliceTypes'

export const TodosWrapper = () => {
    // const { categoryId } = useParams<CategoryParamsType>()
    const navigate = useNavigate()

    let location = useLocation();

    // console.log(location);
    





    const selectedCategory = useAppSelector(state => state.todos.selectedCategory)

    const selected = useAppSelector(state => state.categories.selected)

    const categories = useAppSelector(state => state.categories.items)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const showLoadPage = useLoadDelay(!!todosRequestId, 200)

    const dispatch = useAppDispatch()


    useEffect(() => {
      console.log('Set Selected');
      
    }, [selected])
    


    // useEffect(() => {
    //     console.log(selected?.name)
    // }, [selected])

    //const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // const selectedCategory = useMemo(
    //     () => categoryId && categories.find(category => category.id === categoryId),
    //     [categoryId, categories]
    // )

    // useEffect(() => {
    //     const selectedCategory =
    //         categoryId && categories.find(category => category.id === categoryId)

    //     // console.log('useEffect')

    //     if (selectedCategory) {
    //         if (selectedCategory.id !== categoryId) dispatch(getTodosThunk({ selectedCategory }))
    //     } else if (categoryId) navigate('/', { replace: true })
    // }, [categoryId, categories, navigate, dispatch])

    // useEffect(() => {
    //     if (categoryId && !categories.find(category => category.id === categoryId)) {
    //         console.log('Redirect')
    //     }
    // }, [categoryId, categories])

    // useEffect(() => {
    //     console.log('selected')
    // }, [selected])

    // useEffect(() => {
    //     console.log('categories')
    // }, [categories])

    // useEffect(() => {
    //     console.log('categoryId')
    // }, [categoryId])

    // useEffect(() => {
    //     console.log('Todo Wrapper')
    // })

    return (
        <div className='todos'>
            {showLoadPage ? (
                <div>Loading...</div>
            ) : 
            selectedCategory ? (
                <Todos selectedCategory={selectedCategory} />
            ) : (
                <div>Choose Category</div>
            )}
        </div>
    )
}
