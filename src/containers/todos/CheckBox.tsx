import './checkbox.css'

export const CheckBox = () => {
    return (
        <label
            style={{
                width: '16px',
                height: '16px',
                fontSize: '16px',
            }}
            className='checkbox__container'
        >
            <input type='checkbox' />
            <div className='background'></div>
            <div className='checkmark'></div>
        </label>
    )
}
