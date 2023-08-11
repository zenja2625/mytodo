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

const foo = () => {}

export const useFormController = <T extends Items>(
    fields: T,
    defaultValues?: DeepPartial<FormData<T>>,
    size: 'small' | 'medium' = 'small',
    validates?: Validate<T>
) => {
    const {
        handleSubmit,
        setFocus,
        clearErrors,
        getFieldState,
        trigger,
        control,
        formState: { errors, isSubmitting, isDirty, isValid, isSubmitSuccessful },
    } = useForm({ mode: 'onTouched', defaultValues })

    const canSubmit = !isSubmitting && isDirty && isValid

    useEffect(() => {
        if (canSubmit) clearErrors()
    }, [canSubmit, clearErrors])

    // useEffect(() => {
    //     const keys = Object.keys(fields)

    //     if (keys.length > 0) {
    //         const key = keys[0] as Path<FormData<typeof fields>>
    //         setFocus(key)
    //     }
    // }, [fields, setFocus])

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
                                    fullWidth
                                    size={size}
                                    error={!!stringError}
                                    helperText={stringError}
                                    required={!!field.required}
                                    label={field.placeholder}
                                    value={value}
                                    onChange={fieldRender.onChange}
                                    onBlur={fieldRender.onBlur}
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
                                    slotProps={{
                                        textField: { fullWidth: true, size },
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
                                    fullWidth
                                    type='password'
                                    size={size}
                                    error={!!stringError}
                                    helperText={stringError}
                                    required={!!field.required}
                                    label={field.placeholder}
                                    value={value}
                                    onChange={fieldRender.onChange}
                                    onBlur={fieldRender.onBlur}
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
    }
}
