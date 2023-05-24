import { useCallback, useContext, useRef } from 'react'
import { modalContext } from './ModalProvider'
import { Form, FormRef } from '../form/Form'
import { FormData, Items, PartialFormData } from '../form/types'
import { DeepPartial } from 'react-hook-form'

export const useModal = <T extends Items>(items: T) => {
    const ref = useRef<FormRef>(null)

    const { openModal } = useContext(modalContext)

    return useCallback(
        (
            onSubmit: (data: PartialFormData<T>) => Promise<void>,
            title: string,
            buttonValue?: string,
            defaultValues?: DeepPartial<FormData<T>>
        ) => {
            const content = (
                <Form
                    ref={ref}
                    fields={items}
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

            const submit = async () => {
                await ref.current?.submit()
            }

            openModal(content, title, submit, subscribe, buttonValue)
        },
        [openModal]
    )
}
