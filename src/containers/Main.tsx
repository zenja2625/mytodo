import { Controller, useForm } from 'react-hook-form'
import { Categories } from './categories/Categories'
import { Todos } from './todos/Todos'

export const Main = () => {
    const {control} = useForm({defaultValues: { date2: 4,asd:'' }})
    return (
        <main>
            {/* <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type='date'
                    {...register('date', {
                        onBlur(event) {
                            console.log('Blur')
                        },

                        onChange(event: React.ChangeEvent<HTMLInputElement>) {
                            // console.log(event.currentTarget.value)
                        },
                        // validate: (data, asda) => '{}',

                        setValueAs(value) {
                            // console.log(value)

                            return 'qweqw'
                        },
                    })}
                />

                <Controller
                    name='date2'
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field, fieldState, formState }) => {
                        console.log(field.value)
                        // console.log(fieldState)
                        // console.log(formState)
                        return (
                            <input
                                type='date'
                                onChange={event => {
                                    field.onChange(event)
                                    setValue('date2', moment(event.currentTarget.value, serverDateFormat))
                                }}
                                onBlur={field.onBlur}
                                value={field.value.format(serverDateFormat)}
                            />
                        )
                    }}
                />
                <input type='submit' />
            </form> */}

            <Categories />
            <Todos />
        </main>
    )
}
