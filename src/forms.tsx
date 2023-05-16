import { DateField, OptionalDateField, TextField } from './containers/form/types'

type LoginFields = {
    name: TextField
    password: TextField
}

type RegisterFields = {
    name: TextField
    password: TextField
    confirmPassword: TextField
}

type CategoryFields = {
    name: TextField
}

type TodoFields = {
    value: TextField
    taskEnd: OptionalDateField
}

export const loginFields: LoginFields = {
    name: {
        type: 'text',
        required: 'This field is required',
        placeholder: 'Login',
    },
    password: {
        type: 'password',
        required: 'This field is required',
        minLength: { value: 4, message: 'Не менее 4 символов' },
        placeholder: 'Password',
    },
}

export const registerFields: RegisterFields = {
    name: {
        type: 'text',
        required: 'This field is required',
        placeholder: 'Login',
    },
    password: {
        type: 'password',
        required: 'This field is required',
        minLength: { value: 4, message: 'Не менее 4 символов' },
        placeholder: 'Password',
    },
    confirmPassword: {
        type: 'password',
        required: 'This field is required',
        minLength: { value: 4, message: 'Не менее 4 символов' },
        placeholder: 'Confirm Password',
    },
}

export const categoryFields: CategoryFields = {
    name: {
        type: 'text',
        required: 'This field is required',
        placeholder: 'Category Name',
    },
}

export const todoFields: TodoFields = {
    value: {
        type: 'text',
        required: 'This field is required',
        placeholder: 'Category Name',
    },
    taskEnd: {
        type: 'date',
    },
}
