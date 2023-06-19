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
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <div
                style={{
                    width: '800px',
                    maxWidth: '800px',
                    margin: '0 45px 0 45px',
                }}
            >
                {header}
                <div ref={ref} {...rest}>
                    {isDrag && (
                        <div
                            style={{
                                position: 'absolute',
                                backgroundColor: 'gray',
                                height: `${itemHeight}px`,
                                top: `${yOffset}px`,
                                right: 0,
                                left: `${xOffset}px`,
                            }}
                        ></div>
                    )}
                    {children}
                </div>
                {footer}
            </div>
        </div>
    )
})
