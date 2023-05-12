import { PropsWithChildren, createContext, useCallback, useState } from 'react'
import { FormType } from './utils/types'
import { FieldValues } from 'react-hook-form'
import { Form } from './utils/Form'

//{ openModal: <T extends FieldValues>(form: FormType<T>) => void }

type ModalContextType = {
    openModal: <T extends FieldValues>(form: FormType<T>) => void
    setContent: (content: JSX.Element) => void
}

const initialState = {
    openModal: <T extends FieldValues>(form: FormType<T>) => {},
    setContent: () => {},
}

export const modalContext = createContext<ModalContextType>(initialState)

export const ModalContext = ({ children }: PropsWithChildren) => {
    const [form, setContent] = useState<JSX.Element | null>(null)

    const onSuccessfulSubmit = useCallback(() => {
        setContent(null)
    }, [])

    const openModal = useCallback(
        <T extends FieldValues>(form: FormType<T>) => {
            const formElement = <Form {...form} onSuccessfulSubmit={onSuccessfulSubmit} />
            setContent(formElement)
        },
        [onSuccessfulSubmit]
    )

    const value: ModalContextType = {
        openModal,
        setContent,
    }

    return (
        <modalContext.Provider value={value}>
            {form && (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={() => setContent(null)}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'gray',
                            opacity: 0.6,
                        }}
                    ></div>
                    <div
                        style={{
                            backgroundColor: 'lightgray',
                            width: '300px',
                            height: '300px',
                            zIndex: 1000,
                        }}
                    >
                        {form}
                    </div>
                </div>
            )}
            {children}
        </modalContext.Provider>
    )
}
