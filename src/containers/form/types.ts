import { Path, PathValue, ValidationRule } from 'react-hook-form'

type FieldBase = {
    required?: string
    minLength?: ValidationRule<number>
    placeholder?: string
}

export type TextField = {
    type: 'text' | 'password'
} & FieldBase

export type DateField = {
    type: 'date'
} & FieldBase

export type Field = TextField | DateField

export type Items = {
    [key: string]: Field
}

export type MyItems = {
    name: TextField
    surname: TextField
    birthday: DateField
}

export type ItemDataType<T> = T extends TextField ? string : T extends DateField ? number : never

export type Data<T> = {
    [K in keyof T]: ItemDataType<T[K]>
}

export type Validate<T> = {
    [K in keyof T]: (item: PathValue<Data<T>, Path<Data<T>>>, items: Data<T>) => string | undefined
}

export const items: MyItems = {
    name: {
        type: 'text',
    },
    surname: {
        type: 'text',
    },
    birthday: {
        type: 'date',
    },
}
