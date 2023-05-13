import { DeepPartial, Path, useForm } from 'react-hook-form'
import { Data, Items, Validate } from './types'

type FormProps<T> = {
    items: T
    onSubmit: (data: Data<T>) => Promise<void>
    defaultValues?: DeepPartial<Data<T>>
    validates?: Validate<T>
}

export const Form = <T extends Items = Items>({
    items,
    defaultValues,
    validates,
    onSubmit,
}: FormProps<T>) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({ defaultValues })

    const inputs = Object.keys(items).map(key => {
        const { type, minLength, required, placeholder } = items[key]

        const a = key as Path<Data<T>> 

        const props = register(key as Path<Data<T>>, {
            required,
            minLength,
        })

        const asd = errors[a]?.message


        console.log(asd);
        

        switch (type) {
            case 'text':
                return (
                    <div>
                        <input placeholder={placeholder} {...props} />
                        {/* <div>{asd}</div> */}
                    </div>
                )
            case 'date':
                return <input placeholder={placeholder} {...props} />
            case 'password':
                return <input type='password' placeholder={placeholder} {...props} />
        }
    })

    return (
        <form
            style={{ display: 'flex', flexDirection: 'column' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            {inputs}
            <input type='submit' />
        </form>
    )
}

//Отдельны парметр компере объекст {key: key}
