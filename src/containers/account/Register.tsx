import { useCallback } from 'react'
import { UserRegisterDTO } from '../../api/apiTypes'
import { registerFields } from '../../forms'
import { registerThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../slices/store'
import { Form } from '../form/Form'
import { Validate } from '../form/types'

export const Register = () => {
    const dispath = useAppDispatch()

    const onSubmit = useCallback(
        async (data: UserRegisterDTO) => {
            await dispath(registerThunk(data))
        },
        [dispath]
    )

    const validates: Validate<typeof registerFields> = {
        password(field, fields) {
            if (field !== fields.confirmPassword) return 'Errors'
        },
    }

    return <Form fields={registerFields} onSubmit={onSubmit} validates={validates} />
}
