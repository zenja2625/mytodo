import { useCallback, useRef, useState } from 'react'
import { useAppDispatch } from '../../slices/store'
import { UserLoginDTO } from '../../api/apiTypes'
import { Form } from '../form/Form'
import { loginFields } from '../../forms'
import { loginThunk } from '../../slices/accountSlice'

export const Login = () => {
    const [count, setCount] = useState(0)

    const dispath = useAppDispatch()

    const onSubmit = useCallback(
        async (data: UserLoginDTO) => {
            await dispath(loginThunk(data))
        },
        [dispath]
    )

    return (
        <>
            <div
                onClick={() => {
                    setCount(prev => prev + 1)
                }}
            >
                {count}
            </div>
            <Form fields={loginFields} onSubmit={onSubmit} />
        </>
    )
}
