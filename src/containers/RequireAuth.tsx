import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../slices/store'

export const RequireAuth = () => {
    const isAuth = useAppSelector(state => state.account.isAuth)
    const location = useLocation()


    return isAuth ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />
}
