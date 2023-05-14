import { DateField, TextField } from './containers/form/types'

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
    value: TextField
}

type TodoFields = {
    value: TextField
    date: DateField
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
    value: {
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
    date: {
        type: 'date',
    },
}
