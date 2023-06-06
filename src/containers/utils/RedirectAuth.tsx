import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../slices/store'

export const RedirectAuth = () => {
    const isAuth = useAppSelector(state => state.account.isAuth)
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    console.log('Login')

    return !isAuth ? <Outlet /> : <Navigate to={from} replace />
}
