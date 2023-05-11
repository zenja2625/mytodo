import { TodoEditValue } from './containers/todos/types'
import { FormFieldsType } from './containers/utils/types'

export const todoFields: FormFieldsType<TodoEditValue> = {
    value: {
        options: {
            required: true,
        },
    },
    taskEnd: {
        inputType: 'date',
    },
}
