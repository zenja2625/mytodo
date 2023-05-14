import { useCallback, useState } from 'react'
import { useAppDispatch } from '../../slices/store'
import { UserLoginDTO } from '../../api/apiTypes'
import { Form } from '../form/Form'
import { loginFields } from '../../forms'

export const Login = () => {
    const [count, setCount] = useState(0)

    const dispath = useAppDispatch()

    const onSubmit = useCallback(
        async (data: UserLoginDTO) => {
            // await dispath(loginThunk(data))
            alert(JSON.stringify(data))
        },
        [dispath]
    )

    return (
        <>
            <div onClick={() => setCount(prev => prev + 1)}>{count}</div>
            <Form items={loginFields} onSubmit={onSubmit} />
        </>
    )
}
