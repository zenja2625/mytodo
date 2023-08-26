import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { Header } from './components/header/Header'
import { LoadPage } from './components/LoadPage'
import { CategoryParamsType } from './containers/types'
import { initializeApp } from './slices/appSlice'
import { useAppDispatch, useAppSelector } from './slices/store'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

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
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Header />
            <Outlet />
        </LocalizationProvider>
    )
}
