import { useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryItem } from './CategoryItem'
import {
    createCategoryThunk,
    setSelectedCategory,
    updateCategoryThunk,
} from '../../slices/categoriesSlice'
import { CategoryRequestDTO } from '../../api/apiTypes'
import { categoryFields } from '../../forms'
import { DeepPartial } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { CategoryParamsType } from '../types'
import {
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ModalProps,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { toggleSider } from '../../slices/appSlice'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { FormData } from '../form/types'
import { ModalForm } from '../form/ModalForm'

export const Categories = () => {
    const prevSmallScreen = useRef<boolean | null>(null)
    const prevCategoryId = useRef<string | null>(null)
    // const { categoryId } = useParams<CategoryParamsType>()

    const [editId, setEditId] = useState('')
    const [defaultEditValues, setDefaultEditValues] = useState<DeepPartial<CategoryRequestDTO>>()

    const selectedCategory = useAppSelector(state => state.categories.selected)
    const categories = useAppSelector(state => state.categories.items)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    // const open = useModal(categoryFields)

    const theme = useTheme()
    const smallScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const isOpen = useMemo(() => {
        if (prevSmallScreen.current === smallScreen) {
            return !siderCollapsed
        } else {
            prevSmallScreen.current = smallScreen
            return !smallScreen
        }
    }, [smallScreen, siderCollapsed])

    useEffect(() => {
        if (isOpen !== !siderCollapsed) dispatch(toggleSider())
    }, [isOpen, siderCollapsed, dispatch])

    useEffect(() => {
        const selectedCategoryId = selectedCategory?.id || null

        if (smallScreen && isOpen && prevCategoryId.current !== selectedCategoryId) {
            dispatch(toggleSider())
        }

        prevCategoryId.current = selectedCategoryId
    }, [selectedCategory, isOpen, smallScreen, dispatch])

    const onCreateSubmit = useCallback(
        //todo Error handling
        async (data: CategoryRequestDTO) => {
            const response = await dispatch(createCategoryThunk(data.name))
            // dispatch(setSelectedCategory({id: 'asd', name: 'aaa'}))

            // console.log(response);

            if (response.payload) navigate(`/category/${response.payload}`)

            // const response = await dispatch(createCategoryThunk(data.name))
            // await new Promise(r => setTimeout(r, 1000))

            // dispatch(setSelectedCategory({ id: 'asd', name: 'aaa' }))
            // navigate(`/category/155`)

            // await new Promise(r => setTimeout(r, 3000))
        },
        [navigate, dispatch]
    )

    const openCreateEditor = () => {
        setEditId('new')
        setDefaultEditValues(undefined)
    }

    const openEditEditor = useCallback(
        (id: string, defaultValues: DeepPartial<CategoryRequestDTO>) => {
            setEditId(id)
            setDefaultEditValues(defaultValues)
        },
        []
    )

    const modalProps: Partial<ModalProps> | undefined = {
        style: { top: '60px' },
        BackdropProps: {
            style: {
                top: '60px',
            },
        },
    }

    return (
        <>
            <Drawer
                PaperProps={{ style: { top: '60px', border: 'none', backgroundColor: '#FAFAFA' } }}
                ModalProps={modalProps}
                variant={smallScreen ? 'temporary' : 'persistent'}
                style={!isOpen ? undefined : { width: '250px' }}
                open={isOpen}
                onClose={() => dispatch(toggleSider())}
            >
                <Box width={250} boxSizing='border-box' p={1}>
                    <Typography variant='h5'>Категории</Typography>
                    <List>
                        {categories.map(category => (
                            <CategoryItem
                                key={category.id}
                                id={category.id}
                                name={category.name}
                                openEdit={openEditEditor}
                                selected={category.id === selectedCategory?.id}
                            />
                        ))}
                        <Button onClick={() => openCreateEditor()}>Новая Категория</Button>
                    </List>
                </Box>
            </Drawer>
            <ModalForm
                fields={categoryFields}
                isOpen={!!editId}
                //@ts-ignore
                onSubmit={async (data, e) => {

                    await new Promise(r => setTimeout(r, 1000))
                    console.log(e)

                    // alert(JSON.stringify(data, null, 2))
                }}
                setIsOpen={() => setEditId('')}
                title='Title'
                defaultValues={defaultEditValues}
            />
        </>
    )
}
