import { FieldValues, Path, RegisterOptions, SubmitHandler } from 'react-hook-form'

export type FormFieldType<T extends FieldValues> = {
    options: RegisterOptions<T, Path<T>>
    compareWith?: Path<T>
}

export type FormFieldsType<T extends FieldValues> = Record<keyof T, FormFieldType<T>>

export type FormType<T extends FieldValues> = {
    fields: FormFieldsType<T>
    onSubmit: SubmitHandler<T>
}
