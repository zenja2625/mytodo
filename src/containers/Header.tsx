import { useNavigate } from 'react-router-dom'
import { logoutThunk } from '../slices/accountSlice'
import { useAppDispatch, useAppSelector } from '../slices/store'
import { toggleSider } from '../slices/appSlice'
import { setSelectedCategory } from '../slices/categoriesSlice'

export const Header = () => {
    const navigate = useNavigate()
    const { isAuth, username } = useAppSelector(state => state.account)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const dispatch = useAppDispatch()

    return (
        <div className='header'>
            <div style={{ display: 'flex' }}>
                <button onClick={() => dispatch(toggleSider())}>
                    {siderCollapsed ? 'colaps' : 'show'}
                </button>
                <div
                    onClick={() => {
                        // dispatch(setSelectedCategory(null))
                        navigate('/')
                    }}
                >
                    MyTodo
                </div>
            </div>
            {!isAuth ? (
                <div>
                    <button onClick={() => {navigate('/login')}}>Вход</button>
                    <button onClick={() => {navigate('/register')}}>Регистрация</button>
                </div>
            ) : (
                <div>
                    {username}
                    <button
                        onClick={() => {
                            dispatch(logoutThunk())
                        }}
                    >
                        Выход
                    </button>
                </div>
            )}
        </div>
    )
}
