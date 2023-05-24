import {
    PropsWithChildren,
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

export type ModalContextInitialValueProps = {
    openModal: (
        content: JSX.Element,
        title: string,
        submit: () => Promise<void>,
        subscribeFromStatus: (
            updateFormStatus: (
                isButtonDisabled: boolean,
                isSubmitting: boolean,
                isSubmitSuccessful: boolean
            ) => void
        ) => void,
        buttonValue?: string
    ) => void
}

export const ModalContextInitialValue: ModalContextInitialValueProps = {
    openModal: () => {},
}

export const modalContext = createContext(ModalContextInitialValue)

export const ModalProvider = ({ children }: PropsWithChildren) => {
    const submitRef = useRef<() => void>()
    const subscribeRef =
        useRef<
            (
                updateFormStatus: (
                    isButtonDisabled: boolean,
                    isSubmitting: boolean,
                    isSubmitSuccessful: boolean
                ) => void
            ) => void
        >()

    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
    const [content, setContent] = useState<JSX.Element | null>(null)
    const [title, setTitle] = useState('None')
    const [buttonValue, setButtonValue] = useState('Ok')

    useEffect(() => {
        if (isSubmitSuccessful) {
            setContent(null)
        }
    }, [isSubmitSuccessful])

    const close = useCallback(() => {
        setContent(null)
    }, [])

    const updateFormStatus = useCallback(
        (isButtonDisabled: boolean, isSubmitting: boolean, isSubmitSuccessful: boolean) => {
            setIsButtonDisabled(isButtonDisabled)
            setIsSubmitting(isSubmitting)
            setIsSubmitSuccessful(isSubmitSuccessful)
        },
        []
    )

    useEffect(() => {
        if (content !== null) {
            subscribeRef.current?.(updateFormStatus)
        }
    }, [content, updateFormStatus])

    const value: ModalContextInitialValueProps = useMemo(
        () => ({
            openModal(content, title, submit, subscribeFromStatus, buttonValue = 'Ok') {
                submitRef.current = submit
                subscribeRef.current = subscribeFromStatus

                setContent(content)
                setTitle(title)
                setButtonValue(buttonValue)
            },
        }),
        []
    )

    return (
        <modalContext.Provider value={value}>
            {content && (
                <div
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        zIndex: 10000,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        onClick={() => close()}
                        style={{
                            position: 'absolute',
                            backgroundColor: 'gray',
                            height: '100%',
                            width: '100%',
                            opacity: 0.6,
                        }}
                    ></div>
                    <div
                        style={{
                            width: '300px',
                            backgroundColor: 'orangered',
                            zIndex: 10000,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            gap: '20px',
                        }}
                    >
                        <div>{title}</div>

                        {content}

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'right',
                            }}
                        >
                            <button onClick={() => close()}>Cancel</button>
                            <button
                                disabled={isButtonDisabled}
                                onClick={() => {
                                    submitRef.current?.()
                                    // close()
                                }}
                            >
                                {buttonValue}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {children}
        </modalContext.Provider>
    )
}
