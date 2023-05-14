import { DeepPartial, Path, useForm } from 'react-hook-form'
import { Data, Items, Validate } from './types'

type FormProps<T> = {
    items: T
    onSubmit: (data: Data<T>) => Promise<void>
    defaultValues?: DeepPartial<Data<T>>
    validates?: Validate<T>
}

export const Form = <T extends Items>({
    items,
    defaultValues,
    validates,
    onSubmit,
}: FormProps<T>) => {
    const {
        handleSubmit,
        register,
        getValues,
        formState: { errors, isSubmitting, isDirty, isValid },
    } = useForm({ mode: 'onTouched', defaultValues })

    const inputs = Object.keys(items).map(objectKey => {
        const key = objectKey as Path<Data<T>>

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
                input = <input key={key} placeholder={placeholder} {...props} />
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
            <input disabled={isSubmitting || !isDirty || !isValid} type='submit' />
        </form>
    )
}
