import { useCallback, useState } from 'react'
import { useAppDispatch } from '../../slices/store'
import { loginThunk } from '../../slices/accountSlice'
import { RegisterOptions, SubmitHandler } from 'react-hook-form'
import { UserLoginDTO } from '../../api/apiTypes'
import { FormFieldsType } from '../utils/types'
import { Data, TextField } from '../form/types'
import { Form } from '../form/Form'

type LoginFields = {
    name: TextField
    password: TextField
}

const A = (item: keyof LoginFields) => {}

const loginFields: LoginFields = {
    name: {
        type: 'text',
        required: 'This field is required',
        placeholder: 'Login'
    },
    password: {
        type: 'password',
        required: 'This field is required',
        minLength: { value: 4, message: 'Не менее 4 символов' },
        placeholder: 'Password'
    },
}

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
