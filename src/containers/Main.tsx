import { useEffect } from 'react'
import { Categories } from './categories/Categories'
import { useModal } from './modal/useModal'
import { Todos } from './todos/Todos'
import { Form } from './form/Form'
import { items } from './form/types'

export const Main = () => {
    return (
        <main>
            <Categories />
            <Todos />
        </main>
    )
}
