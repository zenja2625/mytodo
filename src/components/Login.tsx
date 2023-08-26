import { useCallback } from 'react'
import { useAppDispatch } from '../slices/store'
import { UserLoginDTO } from '../api/apiTypes'
import { Form } from '../containers/form/Form'
import { loginFields } from '../forms'
import { loginThunk } from '../slices/accountSlice'
import { Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'

export const Login = () => {
    const dispath = useAppDispatch()

    const onSubmit = useCallback(
        async (data: UserLoginDTO) => {
            await dispath(loginThunk(data))
        },
        [dispath]
    )

    return (
        <Box flexGrow={1} alignItems='center' justifyContent='center' display='flex'>
            <Stack maxWidth='400px' spacing={3} flexGrow={1} m={4}>
                <Typography textAlign='center' variant='h4'>
                    Log In
                </Typography>

                <Form fields={loginFields} onSubmit={onSubmit} size='medium' submitText='Войти' />
            </Stack>
        </Box>
    )
}
