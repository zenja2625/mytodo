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
                <svg style={{ height: '16px' }} viewBox='0 0 100 50'>
                    <circle cx='30' cy='25' r='5' fill='black' />
                    <circle cx='50' cy='25' r='5' fill='black' />
                    <circle cx='70' cy='25' r='5' fill='black' />
                </svg>
            </div>

            {isOpen && (
                <Menu disableAutoFocusItem={true} anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
                    <MenuItem  onClick={() => onClick('change')}>
                        Изменить
                    </MenuItem>
                    <MenuItem onClick={() => onClick('up')}>Добавить выше</MenuItem>
                    <MenuItem onClick={() => onClick('down')}>Добавить ниже</MenuItem>
                    <MenuItem onClick={() => onClick('remove')}>Удалить</MenuItem>
                </Menu>
            )}
        </>
    )
}
