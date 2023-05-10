import { useEffect, useState } from 'react'

export const useDebounce = <T,>(value: T, delayMS: number, event: (value: T) => void) => {
    useEffect(() => {
        const handler = setTimeout(() => {
            event(value)
        }, delayMS)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delayMS, event])
}
