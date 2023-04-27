import { useCallback } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { UserRegisterDTO } from '../../api/apiTypes'
import { registerThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../slices/store'
import { FormFieldsType } from '../utils/types'
import { Form } from '../utils/Form'

export const Register = () => {
    const dispath = useAppDispatch()

    const onSubmit: SubmitHandler<UserRegisterDTO> = useCallback(
        async data => {
            await dispath(registerThunk(data))
        },
        [dispath]
    )

    const value: FormFieldsType<UserRegisterDTO> = {
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
        confirmPassword: {
            options: {
                required: 'Это поле обязательно',
                minLength: { value: 4, message: 'Не менее 4 символов' },
            },
            compareWith: 'password',
        },
    }

    return <Form fields={value} onSubmit={onSubmit} />
}
