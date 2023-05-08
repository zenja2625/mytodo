import React, { FC, memo, useEffect, useLayoutEffect, useRef } from 'react'
import { Todo } from '../../slices/sliceTypes'
import { DragHandleProps } from '../sortableTree/types'
import { areEqual } from 'react-window'

export const TodoItem1: FC<{ item: Todo; handleProps: DragHandleProps }> = memo(
    ({ handleProps, item }) => {
        const ref = useRef(0)

        useLayoutEffect(() => {
            ref.current++
        })

        // useEffect(() => {
        //     console.log('Update ');
            
        // }, [item])

        return (
            <div
                {...handleProps}
                style={{
                    backgroundColor: 'red',
                    height: '100%',
                    width: '100%',
                }}
            >
                {item.value} {item.depth}
                <div style={{ position: 'absolute', right: 30, color: 'white', top: 10 }}>
                    {ref.current}{' '}
                </div>
            </div>
        )
    },
    areEqual
)
