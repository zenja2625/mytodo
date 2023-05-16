import { DeepPartial, Path, useForm } from 'react-hook-form'
import { FormData, Items, PartialFormData, Validate } from './types'
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'


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

        const props = register(key, {
            required,
            minLength,
            validate: validates?.[key] ? data => validates?.[key]?.(data, getValues()) : undefined,
        })

        const error = errors[key]?.message
        const stringError = typeof error === 'string' ? error : undefined

        let input: JSX.Element

        switch (type) {
            case 'text':
                input = <input key={key} placeholder={placeholder} {...props} />
                break
            case 'date':
                input = <input key={key} type='date' placeholder={placeholder} {...props} />
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
