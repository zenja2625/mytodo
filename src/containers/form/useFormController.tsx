import { Controller, DeepPartial, Path, useForm, UseFormHandleSubmit } from 'react-hook-form'
import { FormData, Items, PartialFormData, Validate } from './types'
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import moment from 'moment'
import { Stack } from '@mui/system'
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    TextField,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

export const useFormController = <T extends Items>(
    fields: T,
    size: 'small' | 'medium' = 'small',
    validates?: Validate<T>,
    defaultValues?: DeepPartial<FormData<T>>
) => {
    const {
        handleSubmit,
        clearErrors,
        getFieldState,
        trigger,
        reset,
        control,
        formState: { errors, isSubmitting, isDirty, isValid, isSubmitSuccessful },
    } = useForm<FormData<T>>({
        mode: 'onTouched',
        values: defaultValues as any,
        shouldUnregister: true,
    })
    const canSubmit = !isSubmitting && isDirty && isValid

    useEffect(() => {
        if (canSubmit) clearErrors()
    }, [canSubmit, clearErrors])

    const inputs = Object.keys(fields).map(objectKey => {
        const key = objectKey as Path<FormData<typeof fields>>

        const field = fields[key]

        const error = errors[key]?.message
        const stringError = typeof error === 'string' ? error : undefined

        switch (field.type) {
            case 'text':
                return (
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        rules={{
                            required: field.required,
                            minLength: field.minLength,
                            validate: validates?.[key]
                                ? (data, fields) =>
                                      validates?.[key]?.(data, fields, trigger, getFieldState)
                                : undefined,
                        }}
                        render={({ field: fieldRender }) => {
                            const value =
                                typeof fieldRender.value === 'string' ? fieldRender.value : ''

                            return (
                                <TextField
                                    autoFocus={field.focus}
                                    fullWidth
                                    size={size}
                                    error={!!stringError}
                                    helperText={stringError || ' '}
                                    required={!!field.required}
                                    label={field.placeholder}
                                    value={value}
                                    onChange={fieldRender.onChange}
                                    onBlur={fieldRender.onBlur}
                                    FormHelperTextProps={{
                                        sx: { marginTop: 0, marginBottom: '3px' },
                                    }}
                                />
                            )
                        }}
                    />
                )
            case 'date':
                return (
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        rules={{
                            required: field.required,
                            validate: validates?.[key]
                                ? (data, fields) =>
                                      validates?.[key]?.(data, fields, trigger, getFieldState)
                                : undefined,
                        }}
                        render={({ field: fieldRender }) => {
                            const value = moment.isMoment(fieldRender.value)
                                ? fieldRender.value
                                : undefined

                            const minDate = moment()

                            return (
                                <DatePicker
                                    autoFocus={field.focus}
                                    slotProps={{
                                        textField: { fullWidth: true, size, error: false },
                                    }}
                                    onChange={fieldRender.onChange}
                                    defaultValue={value}
                                    minDate={minDate}
                                    label={field.placeholder}
                                />
                            )
                        }}
                    />
                )
            case 'password':
                return (
                    <Controller
                        key={key}
                        name={key}
                        control={control}
                        rules={{
                            required: field.required,
                            minLength: field.minLength,
                            validate: validates?.[key]
                                ? (data, fields) =>
                                      validates?.[key]?.(data, fields, trigger, getFieldState)
                                : undefined,
                        }}
                        render={({ field: fieldRender }) => {
                            const value =
                                typeof fieldRender.value === 'string' ? fieldRender.value : ''

                            return (
                                <TextField
                                    autoFocus={field.focus}
                                    fullWidth
                                    type='password'
                                    size={size}
                                    error={!!stringError}
                                    helperText={stringError || ' '}
                                    required={!!field.required}
                                    label={field.placeholder}
                                    value={value}
                                    onChange={fieldRender.onChange}
                                    onBlur={fieldRender.onBlur}
                                    FormHelperTextProps={{
                                        sx: { marginTop: 0, marginBottom: '3px' },
                                    }}
                                />
                            )
                        }}
                    />
                )
        }
    })

    return {
        inputs,
        canSubmit,
        isSubmitting,
        isSubmitSuccessful,
        handleSubmit,
        reset,
    }
}
