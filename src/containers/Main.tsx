import { useEffect } from 'react'
import { Categories } from './categories/Categories'
import { useModal } from './modal/useModal'
import { Todos } from './todos/Todos'

export const Main = () => {
    const open = useModal()

    useEffect(() => {
        open()
    }, [])

    return (
        <main>
            <Categories />
            <Todos />
        </main>
    )
}
