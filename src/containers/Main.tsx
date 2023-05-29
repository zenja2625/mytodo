import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/store'
import { Categories } from './categories/Categories'
import { TodosWrapper } from './todos/TodosWrapper'
import { CategoryParamsType } from './types'
import { useEffect } from 'react'
import { getCategoriesThunk } from '../slices/categoriesSlice'

export const Main = () => {
    return (
        <main>
            <Categories />
            <TodosWrapper />
        </main>
    )
}
