import { useForm, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { FormType } from './types'

export const Form = <T extends FieldValues>({ fields, defaultValues, onSubmit }: FormType<T>) => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<T>({ mode: 'onTouched', defaultValues })

    const items = (Object.keys(fields) as Array<Path<T>>).map(item => {
        const compareWith = fields[item]?.compareWith

        const options: RegisterOptions<T, Path<T>> = compareWith
            ? {
                  ...fields[item].options,
                  validate: value => {
                      if (getValues(compareWith) !== value) return 'Не совпадают'
                  },
              }
            : fields[item].options

        return (
            <div key={item}>
                <>
                    <input {...register(item, options)} />
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
            <input disabled={isSubmitting} type='submit' />
        </form>
    )
}
