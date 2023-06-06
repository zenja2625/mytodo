import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import './App.css'
import { Header } from './containers/Header'
import { LoadPage } from './containers/LoadPage'
import { initializeApp } from './slices/appSlice'
import { useAppDispatch, useAppSelector } from './slices/store'
import { ModalProvider } from './containers/modal/ModalProvider'
import { CategoryParamsType } from './containers/types'

export const Layout = () => {}

export const App = () => {
    const { categoryId } = useParams<CategoryParamsType>()
    const initialized = useAppSelector(state => state.app.initialized)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!initialized) {
            dispatch(initializeApp(categoryId))
        }
    })

    if (!initialized) return <LoadPage />

    return (
        <ModalProvider>
            <Header />
            <Outlet />
        </ModalProvider>
    )
}
