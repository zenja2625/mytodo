import { DeepPartial, FieldValues, Path, RegisterOptions, SubmitHandler } from 'react-hook-form'

export type FormFieldType<T extends FieldValues> = {
    options?: RegisterOptions<T, Path<T>>
    compareWith?: Path<T>
    inputType?: 'date' | 'text' 
}

export type FormFieldsType<T extends FieldValues> = Record<keyof T, FormFieldType<T>>

export type FormType<T extends FieldValues> = {
    defaultValues?: DeepPartial<T>
    fields: FormFieldsType<T>
    hideButton?: boolean
    onSubmit: SubmitHandler<T>
    onSuccessfulSubmit?: () => void
}

// const asd: FormType<{ asd: string }> = 