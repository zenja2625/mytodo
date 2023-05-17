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

export type FormRef = {
    submit: () => void
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
    items: T
    onSubmit: (data: PartialFormData<T>) => Promise<void>
    defaultValues?: DeepPartial<FormData<T>>
    validates?: Validate<T>
    hideButton?: boolean
}

export const DateItemComp = <T extends Items, K extends Extract<keyof T, string>>( //K extends keys only DateField
    name: K,
    data: T[K],
    control: Control<FormData<T>, any>
    // data: any//DateFieldBase
) => {

    if (data.type === 'date') {
    const qweqw = name

        const asd = (
            <Controller
                name={name}
                // control={control}
                render={({ field }) => {
                    const asdasd = field.value

                    return <div></div>
                }}
            />
        )
    }

    return <div>Form</div>
}

const FormInner: FormComponent = (
    { items, defaultValues, validates, hideButton, onSubmit },
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
        control,
        formState: { errors, isSubmitting, isDirty, isValid, isSubmitSuccessful },
    } = useForm({ mode: 'onTouched', defaultValues })

    useEffect(() => {
        refFormCheck.current(isSubmitting || !isDirty || !isValid, isSubmitting, isSubmitSuccessful)
    }, [isSubmitting, isDirty, isValid, isSubmitSuccessful])

    useImperativeHandle(ref, () => ({
        submit: () => {
            handleSubmit(onSubmit)()
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

    const inputs = Object.keys(items).map(objectKey => {
        const key = objectKey as Path<FormData<typeof items>>

        const { type, minLength, required, placeholder } = items[key]
        const obj = items[key]

        const props = register(key, {
            required,
            minLength,

            validate: validates?.[key] ? data => validates?.[key]?.(data, getValues()) : undefined,
        })

        const error = errors[key]?.message
        const stringError = typeof error === 'string' ? error : undefined

        let input: JSX.Element

        switch (obj.type) {
            case 'date':
                // const asd1: ItemDataType<typeof obj> = moment()
                DateItemComp(key, obj, control)
                input = (
                    <Controller
                        name={key}
                        control={control}
                        // rules={{
                        //     required: required,
                        // }}
                        render={({ field, fieldState, formState }) => {
                            console.log(field.value)
                            // console.log(fieldState)
                            // console.log(formState)
                            return (
                                <input
                                    type='date'
                                    placeholder='asd'
                                    onChange={event => {
                                        field.onChange(event)
                                        // setValue(
                                        //     key,
                                        //     moment(event.currentTarget.value, serverDateFormat)
                                        // )
                                    }}
                                    // onBlur={field.onBlur}
                                    // value={field.value.format(serverDateFormat)}
                                />
                            )
                        }}
                    />
                )

                break

            default:
                break
        }

        switch (type) {
            case 'text':
                input = <input key={key} placeholder={placeholder} {...props} />
                break
            case 'date':
                // input = <DateItemComp type={type} {...prop}/>
                input = (
                    <Controller
                        name={key}
                        control={control}
                        rules={{
                            required: required,
                        }}
                        render={({ field, fieldState, formState }) => {
                            console.log(field.value)
                            // console.log(fieldState)
                            // console.log(formState)
                            return (
                                <input
                                    type='date'
                                    placeholder='asd'
                                    onChange={event => {
                                        field.onChange(event)
                                        // setValue(
                                        //     key,
                                        //     moment(event.currentTarget.value, serverDateFormat)
                                        // )
                                    }}
                                    // onBlur={field.onBlur}
                                    // value={field.value.format(serverDateFormat)}
                                />
                            )
                        }}
                    />
                )

                // input = <input key={key} type='date' placeholder={placeholder} {...props} />
                break
            case 'password':
                input = <input key={key} type='password' placeholder={placeholder} {...props} />
                break
        }

        return (
            <div key={key}>
                {input}
                <div>{stringError}</div>
            </div>
        )
    })

    return (
        <form
            style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            {inputs}
            <input
                hidden={hideButton}
                disabled={isSubmitting || !isDirty || !isValid}
                type='submit'
            />
        </form>
    )
}

export const Form = forwardRef(FormInner) as <T extends Items>(
    props: FormProps<T> & { ref?: Ref<FormRef> }
) => JSX.Element
