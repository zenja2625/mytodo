import { Control, Controller, DeepPartial, Path, useForm } from 'react-hook-form'
import {
    DateFieldBase,
    Field,
    FormData,
    ItemDataType,
    Items,
    KeysMatching1,
    PartialFormData,
    Validate,
} from './types'
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import moment from 'moment'
import { serverDateFormat } from '../../dateFormat'
import { Stack } from '@mui/system'
import { TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

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
}

const FormInner: FormComponent = (
    { fields, defaultValues, validates, hideButton, onSubmit },
    ref
) => {
    const refFormCheck = useRef<
        (isButtonDisabled: boolean, isSubmitting: boolean, isSubmitSuccessful: boolean) => void
    >(() => {})

    const {
        handleSubmit,
        register,
        getValues,
        setValue,
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

    useEffect(() => {
        refFormCheck.current(isSubmitting || !isDirty || !isValid, isSubmitting, isSubmitSuccessful)
    }, [isSubmitting, isDirty, isValid, isSubmitSuccessful])

    useEffect(() => {
        const keys = Object.keys(fields)

        if (keys.length > 0) {
            const key = keys[0] as Path<FormData<typeof fields>>
            setFocus(key)
            // console.log('Set Focus')
        }
    }, [fields, setFocus])

    useImperativeHandle(ref, () => ({
        submit: async () => {
            await handleSubmit(onSubmit)()
        },
        subscribeFormCheck: updateFormStatus => {
            refFormCheck.current = updateFormStatus
            refFormCheck.current(
                isSubmitting || !isDirty || !isValid,
                isSubmitting,
                isSubmitSuccessful
            )
        },
    }))

    const inputs = Object.keys(fields).map(objectKey => {
        const key = objectKey as Path<FormData<typeof fields>>

        const field = fields[key]

        const error = errors[key]?.message
        const stringError = typeof error === 'string' ? error : undefined

        let input: JSX.Element

        switch (field.type) {
            case 'text':
                input = (
                    <Controller
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
                            const value = fieldRender.value as string

                            return (
                                <TextField
                                    fullWidth
                                    size='small'
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
                break
            case 'date':
                input = (
                    <Controller
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

                            const defaultValue = moment()
                            // defaultValue.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                            // defaultValue.subtract(1, 'seconds')
                            console.log(defaultValue)

                            return (
                                <DatePicker
                                    slotProps={{
                                        textField: { fullWidth: true, size: 'small' },
                                    }}
                                    onChange={fieldRender.onChange}
                                    defaultValue={value}
                                    minDate={defaultValue}
                                />
                                // <input
                                //     type='date'
                                //     placeholder='asd'
                                //     onChange={event =>
                                //         field.onChange(
                                //             event.currentTarget.value
                                //                 ? moment(
                                //                       event.currentTarget.value,
                                //                       serverDateFormat
                                //                   )
                                //                 : null
                                //         )
                                //     }
                                //     onBlur={field.onBlur}
                                //     value={value}
                                // />
                            )
                        }}
                    />
                )

                break
            case 'password':
                input = (
                    <Controller
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
                            const value = fieldRender.value as string

                            return (
                                <TextField
                                    fullWidth
                                    type='password'
                                    size='small'
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
                break
        }

        return (
            <div key={key} style={{ backgroundColor: 'aliceblue' }}>
                {input}
                {/* <div>{stringError}</div> */}
            </div>
        )
    })

    return (
        <form
            style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Stack>{inputs}</Stack>
            <input hidden={hideButton} disabled={!canSubmit} type='submit' />
        </form>
    )
}

export const Form = forwardRef(FormInner) as <T extends Items>(
    props: FormProps<T> & { ref?: Ref<FormRef> }
) => JSX.Element
