import { CSSProperties, FC, useMemo, useCallback, memo } from 'react'
import './checkbox.css'

type CheckBoxProps = {
    size?: number
    checked?: boolean
    onChange?: (checked: boolean) => void
}

export const CheckBox: FC<CheckBoxProps> = memo(({ size, checked, onChange }) => {
    const style: CSSProperties = useMemo(
        () => ({
            fontSize: size,
        }),
        [size]
    )

    const onCheckChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.currentTarget.checked)
        },
        [onChange]
    )

    return (
        <label style={style} className='todo-checkbox-wrapper'>
            <input onChange={onCheckChange} checked={checked} type='checkbox' />
            <div className='todo-checkbox'>
                <div className='todo-checkmark'></div>
            </div>
        </label>
    )
})
