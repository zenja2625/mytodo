import { FC } from 'react'
import { PutTodoDTO, Todo } from '../../slices/sliceTypes'
import { deleteTodoThunk, toggleTodoCollapsed, toggleTodoProgress } from '../../slices/todosSlice'
import { useAppDispatch } from '../../slices/store'
import { appDateFormat } from '../../dateFormat'
import { DragHandleProps } from '../sortableTree/types'
import { CheckBox } from './CheckBox'



export const TodoItem: FC<{
    item: Todo
    categoryId: string
    handleProps?: DragHandleProps
    openEditModal: (id: string, defaultValues?: PutTodoDTO) => void
    openAddModal: (overId?: string, addBefore?: boolean) => void
}> = ({ item, categoryId, handleProps, openEditModal, openAddModal }) => {
    const dispatch = useAppDispatch()

    const { id, value, taskEnd } = item

    return (
        <div
            style={{
                backgroundColor: 'red',
                height: '100%',
                width: '100%',
                userSelect: 'none',
                display: 'flex',
            }}
        >
            <div
                {...handleProps}
                style={{
                    position: 'absolute',
                    width: '20px',
                    height: '100%',
                    backgroundColor: 'yellowgreen',
                    left: -20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'move',
                }}
            >
                :
            </div>
            {item.showHideButton && (
                <div
                    onClick={() => {
                        dispatch(toggleTodoCollapsed(item.id))
                    }}
                >
                    {item.isOpen ? '🡫' : '>'}
                </div>
            )}
            {/* <CheckboxLight /> */}
            <CheckBox />
            
            <input
                type='checkbox'
                checked={item.isDone}
                onChange={() => dispatch(toggleTodoProgress(item.id))}
            />
            <div
                style={{
                    padding: '5px',
                    color: 'yellow',
                }}
            >
                {item.id}
            </div>
            <div>
                {item.value} <div>{item.taskEnd && item.taskEnd.format(appDateFormat)}</div>
            </div>
            {
                <>
                    <button
                        onClick={() => {
                            openAddModal(id, true)
                            // openEditor(false, true)
                        }}
                    >
                        Add Up
                    </button>
                    <button
                        onClick={() => {
                            openAddModal(id)
                            // openEditor(false)
                        }}
                    >
                        Add Bottom
                    </button>
                    <button
                        onClick={() => {
                            // openEditor(true)
                            openEditModal(id, { value, taskEnd })
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            const response = window.confirm('Remove this item')

                            if (response) dispatch(deleteTodoThunk({ categoryId, id: item.id }))
                        }}
                    >
                        Delete
                    </button>
                </>
            }
        </div>
    )
}

const CheckboxLight = () => {
    return (
        <>
            {/* <span className='MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary MuiCheckbox-root MuiCheckbox-colorPrimary css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root'>
                <input
                    className='PrivateSwitchBase-input css-1m9pwf3'
                    type='checkbox'
                    data-indeterminate='false'
                />
                <svg
                    className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root'
                    focusable='false'
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    data-testid='CheckBoxOutlineBlankIcon'
                >
                    <path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'></path>
                </svg>
                <span className='MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root'></span>
            </span>

            <span className='MuiButtonBase-root MuiCheckbox-root MuiCheckbox-colorPrimary PrivateSwitchBase-root MuiCheckbox-root MuiCheckbox-colorPrimary Mui-checked MuiCheckbox-root MuiCheckbox-colorPrimary css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root'>
                <input
                    className='PrivateSwitchBase-input css-1m9pwf3'
                    type='checkbox'
                    data-indeterminate='false'
                />
                <svg
                    className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root'
                    focusable='false'
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    data-testid='CheckBoxIcon'
                >
                    <path d='M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'></path>
                </svg>
                <span className='MuiTouchRipple-root css-8je8zh-MuiTouchRipple-root'></span>
            </span> */}
        </>
    )
}
