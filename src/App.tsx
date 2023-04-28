import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './containers/Header'
import { LoadPage } from './containers/LoadPage'
import { Main } from './containers/Main'
import { NotFoundPage } from './containers/NotFoundPage'
import { RedirectAuth } from './containers/utils/RedirectAuth'
import { RequireAuth } from './containers/utils/RequireAuth'
import { Login } from './containers/account/Login'
import { initializeApp } from './slices/appSlice'
import { useAppDispatch, useAppSelector } from './slices/store'
import { Register } from './containers/account/Register'
import { ModalContext } from './containers/ModalContext'

export const App = () => {
    const isAuth = useAppSelector(state => state.account.isAuth)
    const initialized = useAppSelector(state => state.app.initialized)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!initialized) dispatch(initializeApp())
    }, [initialized, dispatch])

    if (!initialized) return <LoadPage />

    return (
        <>
            <ModalContext>
                <Header />
                <div style={{ position: 'absolute', zIndex: '1000', right: 0 }}>
                    <div>isAuth: {isAuth.toString()}</div>
                    <div>initialized: {initialized.toString()}</div>
                </div>

                <Routes>
                    <Route element={<RedirectAuth />}>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                    </Route>

                    <Route element={<RequireAuth />}>
                        <Route path='/' element={<Main />} />
                        <Route path='/category/:categoryId' element={<Main />} />
                    </Route>

                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </ModalContext>
        </>
    )
}
