import { useCallback, useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryItem } from './CategoryItem'
import { createCategoryThunk, updateCategoryThunk } from '../../slices/categoriesSlice'
import { CategoryRequestDTO } from '../../api/apiTypes'
import { useModal } from '../modal/useModal'
import { categoryFields } from '../../forms'
import { DeepPartial } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export const Categories = () => {
    const categories = useAppSelector(state => state.categories.items)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const open = useModal(categoryFields)

    const className = 'categories' + (siderCollapsed ? ' hidden' : '')

    const onCreateSubmit = useCallback(
        async (data: CategoryRequestDTO) => {
            const response = await dispatch(createCategoryThunk(data.name))

            navigate(`/category/${response.payload}`)
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
                <CategoryItem key={item.id} {...item} openEdit={openEditEditor} />
            ))}
            <button onClick={() => openCreateEditor()}>Новая Категория</button>
        </div>
    )
}
