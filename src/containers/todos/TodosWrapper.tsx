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


    return (
        <div className='todos'>
            {showLoadPage ? (
                <div>Loading...</div>
            ) : 
            selected ? (
                <Todos selectedCategory={selected} />
            ) : (
                <div>Choose Category</div>
            )}
        </div>
    )
}
