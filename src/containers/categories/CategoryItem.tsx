import { FC, useCallback, useContext, useState } from 'react'
import { Category } from '../../slices/sliceTypes'
import { useNavigate } from 'react-router-dom'
import { DeepPartial, DefaultValues } from 'react-hook-form'
import { useAppDispatch } from '../../slices/store'
import {
    deleteCategoryThunk,
    setSelectedCategory,
    updateCategoryThunk,
} from '../../slices/categoriesSlice'
import { CategoryRequestDTO } from '../../api/apiTypes'
import { ListItem, IconButton, ListItemButton, ListItemText, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

type MenuKeys = 'edit' | 'remove'

export const CategoryItem: FC<
    Category & {
        openEdit: (id: string, defaultValues: DeepPartial<CategoryRequestDTO>) => void
        selected?: boolean
    }
> = ({ id, name, selected, openEdit }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const isOpen = !!anchorEl
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const onMenuClick = (key: MenuKeys) => {
        switchEvent(key)
        setAnchorEl(null)
    }

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const switchEvent = (key: MenuKeys) => {
        switch (key) {
            case 'edit':
                openEdit(id, { name })
                break

            case 'remove':
                const response = window.confirm('Remove this item')
                if (response) dispatch(deleteCategoryThunk(id))
                break
        }
    }

    return (
        <>
            <ListItem
                key={id}
                secondaryAction={
                    <IconButton onClick={handleClick} edge='end' color='inherit'>
                        <MoreVertIcon />
                    </IconButton>
                }
                disablePadding
            >
                <ListItemButton selected={selected} onClick={() => navigate(`/category/${id}`)}>
                    <ListItemText primary={name} />
                </ListItemButton>
            </ListItem>
            <Menu
                disableAutoFocusItem={true}
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
            >
                <MenuItem onClick={() => onMenuClick('edit')}>Изменить</MenuItem>
                <MenuItem onClick={() => onMenuClick('remove')}>Удалить</MenuItem>
            </Menu>
        </>
    )
}
