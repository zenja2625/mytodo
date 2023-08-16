import { FormProps, Items } from './types'
import { useEffect, useCallback } from 'react'
import { Stack } from '@mui/system'
import {
    Button,
    ButtonProps,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import { useFormController } from './useFormController'

type ModalFormProps<T extends Items> = {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    title: string
} & FormProps<T>

export const ModalForm = <T extends Items>({
    fields,
    isOpen,
    setIsOpen,
    title,
    submitText = 'Отправить запрос',
    defaultValues,
    validates,
    size = 'small',
    onSubmit,
}: ModalFormProps<T>) => {
    const { canSubmit, handleSubmit, reset, inputs, isSubmitting, isSubmitSuccessful } =
        useFormController(fields, size, validates)

    useEffect(() => {
        if (isOpen) {
            if (defaultValues) {
                reset(defaultValues)
            } else {
                console.log('New')
                reset()
            }
        }
    }, [isOpen, defaultValues, reset])

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
            close()
        }
    }, [isSubmitSuccessful, close])

    const buttonProps: ButtonProps = {
        size,
        variant: 'contained',
    }

    return (
        <Dialog maxWidth='xs' fullWidth disableAutoFocus onClose={close} open={isOpen}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent sx={{ paddingBottom: '0px' }}>
                <Stack component={'form'} onSubmit={handleSubmit(onSubmit)} marginTop={1}>
                    {inputs}
                    <input disabled={isSubmitting} hidden type='submit' />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button {...buttonProps} disabled={isSubmitting} onClick={close}>
                    Отмена
                </Button>
                <Button
                    {...buttonProps}
                    onClick={async () => await handleSubmit(onSubmit)()}
                    disabled={!canSubmit}
                    endIcon={
                        isSubmitting ? <CircularProgress color='inherit' size={18} /> : undefined
                    }
                >
                    {submitText}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
