import { useEffect } from 'react'
import { Outlet, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import { Header } from './containers/Header'
import { LoadPage } from './containers/LoadPage'
import { Main } from './containers/Main'
import { NotFoundPage } from './containers/NotFoundPage'
import { RedirectAuth, SelectedCategory } from './containers/utils/RedirectAuth'
import { RequireAuth } from './containers/utils/RequireAuth'
import { Login } from './containers/account/Login'
import { initialization, initializeApp } from './slices/appSlice'
import { useAppDispatch, useAppSelector } from './slices/store'
import { Register } from './containers/account/Register'
import { ModalProvider } from './containers/modal/ModalProvider'
import { CategoryParamsType } from './containers/types'
import { userInfo } from 'os'
import { userInfoThunk } from './slices/accountSlice'

export const App = () => {
    // const isAuth = useAppSelector(state => state.account.isAuth)
    // const initialized = useAppSelector(state => state.app.initialized)
    // const dispatch = useAppDispatch()

    // const { categoryId } = useParams<CategoryParamsType>()

    // useEffect(() => {
    //     if (!initialized) dispatch(initializeApp())
    // }, [initialized, dispatch])

    // if (!initialized) return <LoadPage />

    return (
        <ModalProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route element={<RedirectAuth />}>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route element={<SelectedCategory />}>
                            <Route path='/' element={<Main />} />
                            <Route path='/category/:categoryId' element={<Main />} />
                        </Route>
                    </Route>

                    <Route path='*' element={<NotFoundPage />} />
                </Route>
            </Routes>
        </ModalProvider>
    )
}

export const Layout = () => {
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
        <>
            <Header />
            <Outlet />
        </>
    )
}
