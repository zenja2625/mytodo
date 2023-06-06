import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryParamsType } from '../types'
import { Todos } from './Todos'
import { getTodos } from '../../selectors/getTodos'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { getTodosThunk } from '../../slices/todosSlice'
import { Category } from '../../slices/sliceTypes'

export const TodosWrapper = () => {
    const prevSelectedCategoryRef = useRef<Category | null>(null)

    const selectedCategory = useAppSelector(state => state.categories.selected)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const loadedCategory = useMemo(() => {
        if (!todosRequestId) prevSelectedCategoryRef.current = selectedCategory
        return prevSelectedCategoryRef.current
    }, [selectedCategory, todosRequestId])

    // useEffect(() => {
    //     console.log('selectedCategory')
    // }, [selectedCategory])

    // useEffect(() => {
    //     console.log(`todosRequestId ${todosRequestId}`)
    // }, [todosRequestId])

    // useEffect(() => {
    //     console.log('use Effect')
    // })

    const showLoadPage = useLoadDelay(!!todosRequestId, 200)

    return (
        <div className='todos'>
            {showLoadPage ? (
                <div>Loading...</div>
            ) : loadedCategory ? (
                <Todos selectedCategory={loadedCategory} />
            ) : (
                <div>Choose Category</div>
            )}
        </div>
    )
}
