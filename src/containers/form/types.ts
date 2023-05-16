import { Path, PathValue, ValidationRule } from 'react-hook-form'
import { todoFields } from '../../forms'

type FieldBase = {
    minLength?: ValidationRule<number>
    placeholder?: string
}

type RequiredField = {
    required: string | true
}
type OptionalField = {
    required?: false
}

type TextFieldBase = {
    type: 'text' | 'password'
} & FieldBase

type DateFieldBase = {
    type: 'date'
} & FieldBase

type KeysMatching<T> = { [K in keyof T]: T[K] extends OptionalField ? K : never }[keyof T]

export type TextField = TextFieldBase & RequiredField
export type DateField = DateFieldBase & RequiredField
export type OptionalTextField = TextFieldBase & OptionalField
export type OptionalDateField = DateFieldBase & OptionalField

export type Field = TextField | DateField | OptionalTextField | OptionalDateField

export type Items = {
    [key: string]: Field
}

export type ItemDataType<T> = T extends TextFieldBase
    ? string
    : T extends DateFieldBase
    ? number
    : never

export type FormData<T> = {
    [K in keyof T]: ItemDataType<T[K]>
}

export type PartialFormData<T> = Omit<FormData<T>, KeysMatching<T>> &
    Partial<Pick<FormData<T>, KeysMatching<T>>>

export type Validate<T> = Partial<{
    [K in keyof T]: (item: PathValue<FormData<T>, Path<FormData<T>>>, items: FormData<T>) => string | undefined
}>
