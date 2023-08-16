import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../slices/store'
import { Categories } from './categories/Categories'
import { TodosWrapper } from './todos/TodosWrapper'
import { CategoryParamsType } from './types'
import { useEffect, useState } from 'react'
import { getCategoriesThunk } from '../slices/categoriesSlice'
import { ModalForm } from './form/ModalForm'
import { registerFields } from '../forms'

export const Main = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [count, setCount] = useState(0)

    return (
        <main>
            <Categories />
            <TodosWrapper />
        </main>
    )
}
