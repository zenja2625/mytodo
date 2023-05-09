import { FC, useMemo, useState, CSSProperties, memo } from 'react'
import { OverlayProps } from './types'
import { useListeners } from './useListeners'

export const Overlay: FC<OverlayProps> = memo(
    ({ shift, initialPosition, width, height, children }) => {
        const [coors, setCoors] = useState(initialPosition)

        useListeners(true, setCoors)

        const style: CSSProperties = useMemo(
            () => ({
                position: 'fixed',
                backgroundColor: 'burlywood',
                width: `${width}px`,
                height: `${height}px`,
                top: coors.y - shift.y,
                left: coors.x - shift.x,
            }),
            [coors, shift]
        )

        return <div style={style}>{children}</div>
    }
)
