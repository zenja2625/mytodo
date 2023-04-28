import React, { PropsWithChildren, useState } from 'react'

export const ModalContext = ({ children }: PropsWithChildren) => {
    const [isShow, setIsShow] = useState(true)

    return (
        <>
            {isShow && (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        onClick={() => setIsShow(false)}
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
                    ></div>
                </div>
            )}
            {children}
        </>
    )
}
