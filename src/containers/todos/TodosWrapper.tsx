import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryParamsType } from '../types'
import { Todos } from './Todos'
import { getTodos } from '../../selectors/getTodos'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { getTodosThunk } from '../../slices/todosSlice'
import { Category } from '../../slices/sliceTypes'
import { Container } from '@mui/material'
import { LoadPage } from '../../components/LoadPage'
import Box from '@mui/material/Box'

export const TodosWrapper = () => {
    const prevSelectedCategoryRef = useRef<Category | null>(null)

    const selectedCategory = useAppSelector(state => state.categories.selected)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)

    const loadedCategory = useMemo(() => {
        if (!todosRequestId) prevSelectedCategoryRef.current = selectedCategory
        return prevSelectedCategoryRef.current
    }, [selectedCategory, todosRequestId])

    const showLoadPage = useLoadDelay(!!todosRequestId, 500)

    //think about this
    const style: CSSProperties | undefined = !!todosRequestId
        ? {
              pointerEvents: 'none',
              userSelect: 'none',
          }
        : undefined

    return (
        <Box style={style} flexGrow={1} position='relative'>
            <Box position='absolute' height='100%' width='100%'>
                {loadedCategory ? (
                    <Todos selectedCategory={loadedCategory} />
                ) : (
                    <div>Choose Category</div>
                )}
            </Box>
            {showLoadPage && (
                <Box position='absolute' height='100%' width='100%'>
                    <LoadPage />
                </Box>
            )}
        </Box>
    )
}
