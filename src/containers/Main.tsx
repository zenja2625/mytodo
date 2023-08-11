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

    return (
        <main>
            <Categories />
            <TodosWrapper />
            <ModalForm
                modalTitle='Регистрация'
                buttonValue='Регистрация'
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                fields={registerFields}
                onSubmit={async () => {
                    console.log('Submit')

                    await new Promise(r => setTimeout(r, 3000))
                }}
            />
        </main>
    )
}
