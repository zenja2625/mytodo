import { useState } from 'react'
import { useAppDispatch } from '../../slices/store'
import { loginThunk } from '../../slices/accountSlice'

export const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispath = useAppDispatch()

    return (
        <div>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
            <input type='text' value={password} onChange={e => setPassword(e.target.value)} />
            <button
                onClick={() => {
                    dispath(loginThunk({ name: username, password }))
                }}
            >
                Click
            </button>
        </div>
    )
}
