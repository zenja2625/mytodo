import { useNavigate } from 'react-router-dom'
import { logoutThunk } from '../slices/accountSlice'
import { useAppDispatch, useAppSelector } from '../slices/store'

export const Header = () => {
    const navigate = useNavigate()
    const { isAuth, username } = useAppSelector(state => state.account)

    const dispatch = useAppDispatch()

    return (
        <div className='header'>
            <div
                onClick={() => {
                    navigate('/')
                }}
            >
                MyTodo
            </div>
            {!isAuth ? (
                'Вход'
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
