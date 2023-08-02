import { useCallback } from 'react'
import { UserRegisterDTO } from '../../api/apiTypes'
import { registerFields } from '../../forms'
import { registerThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../slices/store'
import { Form } from '../form/Form'
import { Validate } from '../form/types'
import { Box, Stack, Typography } from '@mui/material'

export const Register = () => {
    const dispath = useAppDispatch()

    const onSubmit = useCallback(
        async (data: UserRegisterDTO) => {
            await dispath(registerThunk(data))
        },
        [dispath]
    )

    const validates: Validate<typeof registerFields> = {
        password(field, fields, trigger, getFieldState) {
            const { isTouched } = getFieldState('confirmPassword')

            if (isTouched) {
                if (field !== fields.confirmPassword) {
                    trigger('confirmPassword')
                }
            }

            return undefined
        },
        confirmPassword(field, fields) {
            if (field !== fields.password) return 'Passwords must match'
        },
    }

    return (
        <Box flexGrow={1} alignItems={'center'} justifyContent={'center'} display={'flex'}>
            <Stack maxWidth={'400px'} spacing={3} flexGrow={1} m={4}>
                <Typography textAlign='center' variant='h4'>
                    Sign up
                </Typography>
                <Form
                    fields={registerFields}
                    onSubmit={onSubmit}
                    validates={validates}
                    size='medium'
                    submitText='Зарегистрироваться'
                />
            </Stack>
        </Box>
    )
}
