import { FormProps, Items } from './types'
import { Stack } from '@mui/system'
import { Button, CircularProgress, Icon } from '@mui/material'
import { useFormController } from './useFormController'

export const Form = <T extends Items>({
    fields,
    defaultValues,
    validates,
    submitText = 'Отправить запрос',
    size = 'small',
    onSubmit,
}: FormProps<T>) => {
    const { inputs, canSubmit, isSubmitting, handleSubmit } = useFormController(
        fields,
        size,
        validates,
        defaultValues
    )

    return (
        <Stack component={'form'} onSubmit={handleSubmit(onSubmit)}>
            {inputs}
            <Button
                type='submit'
                size={size}
                variant='contained'
                disabled={!canSubmit}
                startIcon={<Icon />}
                endIcon={isSubmitting ? <CircularProgress color='inherit' size={18} /> : <Icon />}
            >
                {submitText}
            </Button>
        </Stack>
    )
}
