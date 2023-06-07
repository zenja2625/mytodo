import { useNavigate } from 'react-router-dom'
import { logoutThunk } from '../slices/accountSlice'
import { useAppDispatch, useAppSelector } from '../slices/store'
import { toggleSider } from '../slices/appSlice'
import { setSelectedCategory } from '../slices/categoriesSlice'
import { Link } from 'react-router-dom'
import { memo, useEffect } from 'react'
import { useLoadDelay } from '../hooks/useLoadDelay'

export const Header = memo(() => {
    const { isAuth, username } = useAppSelector(state => state.account)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)
    const requestCount = useAppSelector(state => state.app.requestCount)

    const dispatch = useAppDispatch()

    const showLoadPage = useLoadDelay(requestCount > 0, 200)

    return (
        <div className='header'>
            <div style={{ display: 'flex' }}>
                <button onClick={() => dispatch(toggleSider())}>
                    {siderCollapsed ? 'colaps' : 'show'}
                </button>
                <Link to='/'>MyTodo</Link>
                {showLoadPage && <div>Loading...</div>}
            </div>
            {!isAuth ? (
                <div>
                    <Link to='/login'>
                        <button>Вход</button>
                    </Link>
                    <Link to='/register'>
                        <button>Регистрация</button>
                    </Link>
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
})
