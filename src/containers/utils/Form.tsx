import { useForm, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { FormType } from './types'
import { useEffect } from 'react'

export const Form = <T extends FieldValues>({
    fields,
    defaultValues,
    hideButton = false,
    onSubmit,
    onSuccessfulSubmit,
}: FormType<T>) => {
    const {
        register,
        handleSubmit,
        getValues,

        formState: { errors, isSubmitting, isSubmitSuccessful, isDirty, isValid },
    } = useForm<T>({ mode: 'onTouched', defaultValues })

    useEffect(() => {
        if (isSubmitSuccessful) onSuccessfulSubmit?.()
    }, [isSubmitSuccessful, onSuccessfulSubmit])

    const items = (Object.keys(fields) as Array<Path<T>>).map(item => {
        const compareWith = fields[item]?.compareWith

        const options: RegisterOptions<T, Path<T>> | undefined = compareWith
            ? {
                  ...fields[item].options,
                  validate: value => {
                      if (getValues(compareWith) !== value) return 'Не совпадают'
                  },
              }
            : fields[item].options

        const asd = errors[item]?.message

        return (
            <div key={item}>
                <>
                    {fields[item].inputType === 'date' ? (
                        <input type='date' {...register(item, options)} />
                    ) : (
                        <input {...register(item, options)} />
                    )}

                    {errors[item]?.message}
                </>
            </div>
        )
    })

    return (
        <form
            style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            {items}
            <input
                hidden={hideButton}
                disabled={isSubmitting || !isDirty || !isValid}
                type='submit'
            />
        </form>
    )
}
