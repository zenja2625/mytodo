import { FC } from 'react'
import { Menu, MenuItem } from '@mui/material'
import React from 'react'

export type MenuKeys = 'change' | 'up' | 'down' | 'remove'

type TodoMenuProps = {
    switchEvent: (key: MenuKeys) => void
}

export const TodoMenu: FC<TodoMenuProps> = ({ switchEvent }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const isOpen = !!anchorEl
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const onClick = (key: MenuKeys) => {
        switchEvent(key)
        setAnchorEl(null)
    }

    return (
        <>
            <div onClick={handleClick} className='menu__button'>
                <svg viewBox='0 0 100 50'>
                    <path d='M24,25 A5,5 0 1,0 34,25 A5,5 0 1,0 24,25 Z M44,25 A5,5 0 1,0 54,25 A5,5 0 1,0 44,25 Z M64,25 A5,5 0 1,0 74,25 A5,5 0 1,0 64,25Z' />
                </svg>
            </div>

            {isOpen && (
                <Menu
                    disableAutoFocusItem={true}
                    anchorEl={anchorEl}
                    open={isOpen}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => onClick('change')}>Изменить</MenuItem>
                    <MenuItem onClick={() => onClick('up')}>Добавить выше</MenuItem>
                    <MenuItem onClick={() => onClick('down')}>Добавить ниже</MenuItem>
                    <MenuItem onClick={() => onClick('remove')}>Удалить</MenuItem>
                </Menu>
            )}
        </>
    )
}
