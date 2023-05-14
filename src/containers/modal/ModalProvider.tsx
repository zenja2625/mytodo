import { PropsWithChildren, createContext } from 'react'
import { useForm } from 'react-hook-form'

export type ModalContextInitialValueProps = {}

export const ModalContextInitialValue = {}

export const modalContext = createContext(ModalContextInitialValue)

export const ModalProvider = ({ children }: PropsWithChildren) => {
    


    const { register, handleSubmit } = useForm({ })

    return (
        <modalContext.Provider value={{}}>
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
                    <div>Title</div>

                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                        onSubmit={handleSubmit(data => {
                            alert(JSON.stringify(data))
                        })}
                    >
                        <input type='text' placeholder='name' {...register('name')} />
                        <input type='text' {...register('surname')} />
                        <input type='text' {...register('love')} />
                        <input hidden={true} type='submit' />
                    </form>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'right',
                        }}
                    >
                        <button>Cancel</button>
                        <button
                            onClick={() =>
                                handleSubmit(data => {
                                    alert(JSON.stringify(data))
                                })()
                            }
                        >
                            Ok
                        </button>
                    </div>
                </div>
            </div>
            {children}
        </modalContext.Provider>
    )
}
