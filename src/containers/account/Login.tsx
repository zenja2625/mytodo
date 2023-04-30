import { useCallback } from 'react'
import { useAppDispatch } from '../../slices/store'
import { loginThunk } from '../../slices/accountSlice'
import { SubmitHandler } from 'react-hook-form'
import { UserLoginDTO } from '../../api/apiTypes'
import { Form } from '../utils/Form'
import { FormFieldsType } from '../utils/types'

export const Login = () => {
    const dispath = useAppDispatch()

    const onSubmit: SubmitHandler<UserLoginDTO> = useCallback(
        async data => {

            console.log(data);
            
            await dispath(loginThunk(data))
        },
        [dispath]
    )

    const value: FormFieldsType<UserLoginDTO> = {
        name: {
            options: {
                required: 'Это поле обязательно',
            },
        },
        password: {
            options: {
                required: 'Это поле обязательно',
                minLength: { value: 4, message: 'Не менее 4 символов' },
            },
        },
    }

    return (
        <>
            <Form fields={value} onSubmit={onSubmit} />
        </>
    )
}
