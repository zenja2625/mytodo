import { useCallback, useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryItem } from './CategoryItem'
import {
    createCategoryThunk,
    setSelectedCategory,
    updateCategoryThunk,
} from '../../slices/categoriesSlice'
import { CategoryRequestDTO } from '../../api/apiTypes'
import { useModal } from '../modal/useModal'
import { categoryFields } from '../../forms'
import { DeepPartial } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { CategoryParamsType } from '../types'

export const Categories = () => {
    // const { categoryId } = useParams<CategoryParamsType>()

    const selectedCategory = useAppSelector(state => state.categories.selected)
    const categories = useAppSelector(state => state.categories.items)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const open = useModal(categoryFields)

    const className = 'categories' + (siderCollapsed ? ' hidden' : '')

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
        open(onCreateSubmit, 'Create Category', 'Create')
    }

    const openEditEditor = useCallback(
        (id: string, defaultValues: DeepPartial<CategoryRequestDTO>) => {
            open(
                async data => {
                    await dispatch(updateCategoryThunk({ id, name: data.name }))
                },
                'Update Category',
                'Update',
                defaultValues
            )
        },
        [dispatch]
    )

    return (
        <div className={className}>
            Categories:
            {categories.map(item => (
                <CategoryItem
                    key={item.id}
                    {...item}
                    selected={item.id === selectedCategory?.id}
                    openEdit={openEditEditor}
                />
            ))}
            <CategoryItem id='asd' name='Test' openEdit={openEditEditor} />
            <button onClick={() => openCreateEditor()}>Новая Категория</button>
        </div>
    )
}
