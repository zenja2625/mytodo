import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryParamsType } from '../types'
import { Todos } from './Todos'
import { getTodos } from '../../selectors/getTodos'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { getTodosThunk } from '../../slices/todosSlice'
import { Category } from '../../slices/sliceTypes'
import { Box, Container } from '@mui/material'
import { LoadPage } from '../LoadPage'

export const TodosWrapper = () => {
    const prevSelectedCategoryRef = useRef<Category | null>(null)

    const selectedCategory = useAppSelector(state => state.categories.selected)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const loadedCategory = useMemo(() => {
        if (!todosRequestId) prevSelectedCategoryRef.current = selectedCategory
        return prevSelectedCategoryRef.current
    }, [selectedCategory, todosRequestId])

    const showLoadPage = useLoadDelay(!!todosRequestId, 500)

    const style: CSSProperties | undefined = !!todosRequestId
        ? {
              pointerEvents: 'none',
              userSelect: 'none',
          }
        : undefined

    return (
        <div style={style} className='todos'>
            <div className='todos-wrapper'>
                {loadedCategory ? (
                    <Todos selectedCategory={loadedCategory} />
                ) : (
                    <div className='todos-wrapper-center'>Choose Category</div>
                )}
            </div>
            {showLoadPage && (
                <div className='todos-wrapper'>
                    <LoadPage />
                </div>
            )}
        </div>
    )
}
