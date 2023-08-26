import { logoutThunk } from '../../slices/accountSlice'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { toggleSider } from '../../slices/appSlice'
import { Link } from 'react-router-dom'
import { memo } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import {
    AppBar,
    Avatar,
    Button,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'
import { HeaderIndicator } from './HeaderIndicator'

export const Header = memo(() => {
    const { isAuth, username } = useAppSelector(state => state.account)

    const theme = useTheme()

    const dispatch = useAppDispatch()

    return (
        <AppBar position='static' style={{ zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar style={{ minHeight: '60px' }}>
                {isAuth && (
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        sx={{ mr: 1 }}
                        onClick={() => dispatch(toggleSider())}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography
                    sx={{ textDecoration: 'none' }}
                    color='inherit'
                    component={Link}
                    to='/'
                    variant='h5'
                    mr={1}
                >
                    MyTodo
                </Typography>
                <HeaderIndicator />
                <Typography flexGrow={1} />
                {isAuth ? (
                    <>
                        <Tooltip title={username} arrow>
                            <Avatar sx={{ mr: 1, bgcolor: 'orangered' }}>{username[0]}</Avatar>
                        </Tooltip>
                        <Button onClick={() => dispatch(logoutThunk())} color='inherit'>
                            Выход
                        </Button>
                    </>
                ) : (
                    <>
                        <Button component={Link} to='/login' color='inherit'>
                            Вход
                        </Button>
                        <Button component={Link} to='/register' color='inherit'>
                            Регистрация
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
})
