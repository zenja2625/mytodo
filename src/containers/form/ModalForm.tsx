import { Controller, DeepPartial, Path, useForm, UseFormHandleSubmit } from 'react-hook-form'
import { FormData, Items, PartialFormData, Validate } from './types'
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useCallback } from 'react'
import moment from 'moment'
import { Stack } from '@mui/system'
import {
    Button,
    ButtonProps,
    ButtonTypeMap,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ExtendButtonBase,
    Icon,
    TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useFormController } from './useFormController'

export type FormRef = {
    submit: () => Promise<void>
    subscribeFormCheck: (
        updateFormStatus: (
            isButtonDisabled: boolean,
            isSubmitting: boolean,
            isSubmitSuccessful: boolean
        ) => void
    ) => void
}

type FormComponent = <T extends Items>(props: FormProps<T>, ref?: Ref<FormRef>) => JSX.Element

type FormProps<T> = {
    fields: T
    onSubmit: (data: PartialFormData<T>) => Promise<void>
    defaultValues?: DeepPartial<FormData<T>>
    validates?: Validate<T>
    hideButton?: boolean
    size?: 'small' | 'medium'
    submitText?: string

    isOpen: boolean
    setIsOpen: (value: boolean) => void
    modalTitle: string
    buttonValue: string
}

const FormInner: FormComponent = (
    {
        fields,
        isOpen,
        setIsOpen,
        modalTitle,
        buttonValue,
        defaultValues,
        validates,
        hideButton,
        submitText = 'Отправить запрос',
        size = 'small',
        onSubmit,
    },
    ref
) => {
    const refFormCheck = useRef<
        (isButtonDisabled: boolean, isSubmitting: boolean, isSubmitSuccessful: boolean) => void
    >(() => {})

    const { canSubmit, handleSubmit, inputs, isSubmitting, isSubmitSuccessful } =
        useFormController(fields)

    const close = useCallback(() => {
        setIsOpen(false)
    }, [setIsOpen])

    useEffect(() => {
        if (isSubmitSuccessful) close()
    }, [isSubmitSuccessful, close])

    const buttonProps: ButtonProps = {
        size,
        variant: 'contained',
    }

    return (
        <Dialog disableAutoFocus onClose={close} open={isOpen}>
            <DialogTitle>{modalTitle}</DialogTitle>
            <DialogContent>
                <Stack
                    component={'form'}
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2}
                    marginTop={1}
                >
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
                    {buttonValue}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export const ModalForm = forwardRef(FormInner) as <T extends Items>(
    props: FormProps<T> & { ref?: Ref<FormRef> }
) => JSX.Element
