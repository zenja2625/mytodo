import { useCallback, useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryItem } from './CategoryItem'
import { createCategoryThunk, updateCategoryThunk } from '../../slices/categoriesSlice'
import { CategoryRequestDTO } from '../../api/apiTypes'
type asd = { name: string }

export const Categories = () => {
    const categories = useAppSelector(state => state.categories.items)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const dispatch = useAppDispatch()

    const className = 'categories' + (siderCollapsed ? ' hidden' : '')

    const onSubmit = useCallback(async (data: CategoryRequestDTO) => {
        await dispatch(createCategoryThunk(data.name))
    }, [])

    return (
        <div className={className}>
            Categories:
            {categories.map(item => (
                <CategoryItem key={item.id} {...item} />
            ))}
            <button
                onClick={() => {
                    // openModal(modalProps)
                }}
            >
                Новая Категория
            </button>
        </div>
    )
}
