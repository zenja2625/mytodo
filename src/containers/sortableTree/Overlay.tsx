import { FC, useMemo, useState, CSSProperties, memo } from 'react'
import { OverlayProps } from './types'
import { useListeners } from './hooks/useListeners'

export const Overlay: FC<OverlayProps> = memo(
    ({ shift, initialPosition, width, height, children }) => {
        const [coors, setCoors] = useState(initialPosition)

        useListeners(true, setCoors)

        const style: CSSProperties = useMemo(
            () => ({
                position: 'fixed',
                width: `${width}px`,
                height: `${height}px`,
                top: coors.y - shift.y,
                left: coors.x - shift.x,
                zIndex: 1000
            }),
            [coors, shift]
        )

        return <div style={style}>{children}</div>
    }
)
