import { useContext, useRef } from 'react'
import { modalContext } from './ModalProvider'
import { Form, FormRef } from '../form/Form'
import { Data, Items } from '../form/types'
import { DeepPartial } from 'react-hook-form'

export const useModal = <T extends Items>(items: T) => {
    const ref = useRef<FormRef>(null)

    const { openModal } = useContext(modalContext)

    return (
        onSubmit: (data: Data<T>) => Promise<void>,
        title: string,
        buttonValue?: string,
        defaultValues?: DeepPartial<Data<T>>
    ) => {
        const inputs = (
            <Form
                ref={ref}
                items={items}
                onSubmit={onSubmit}
                hideButton={true}
                defaultValues={defaultValues}
            />
        )

        const subscribe = (
            updateFormStatus: (
                isButtonDisabled: boolean,
                isSubmitting: boolean,
                isSubmitSuccessful: boolean
            ) => void
        ) => {
            ref.current?.subscribeFormCheck(updateFormStatus)
        }

        const submit = () => {
            ref.current?.submit()
        }

        openModal(inputs, title, submit, subscribe, buttonValue)
    }
}
