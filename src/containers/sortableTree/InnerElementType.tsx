import { forwardRef, CSSProperties, useContext, createContext } from 'react'
import { ReactElementType } from 'react-window'
import { InnerElementContext } from './types'

export const innerElementInitialValue: InnerElementContext = {
    isDrag: false,
    itemHeight: 0,
    xOffset: 0,
    yOffset: 0,
}

export const innerElementContext = createContext(innerElementInitialValue)

export const InnerElementType: ReactElementType = forwardRef<
    HTMLDivElement,
    { style: CSSProperties; children: JSX.Element }
>(({ children, ...rest }, ref) => {
    const { isDrag, itemHeight, xOffset, yOffset, footer, header } = useContext(innerElementContext)
    rest = { ...rest, style: { ...rest.style, position: 'relative' } }

    return (
        <>
            {header && (
                <div
                    style={{
                        backgroundColor: 'white',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            padding: '0 45px 0 45px',
                        }}
                    >
                        {header}
                    </div>
                </div>
            )}

            <div
                style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '0 45px 0 45px',
                }}
            >
                <div ref={ref} {...rest}>
                    {isDrag && (
                        <div
                            style={{
                                position: 'absolute',
                                backgroundColor: 'lightgray',
                                height: `${itemHeight}px`,
                                top: `${yOffset}px`,
                                right: 0,
                                left: `${xOffset}px`,
                            }}
                        ></div>
                    )}
                    {children}
                </div>
                {footer && (
                    <>
                        {footer}
                        <div style={{ height: '100px' }}></div>
                    </>
                )}
            </div>
        </>
    )
})
