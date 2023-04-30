import { useContext } from 'react'
import { useAppDispatch, useAppSelector } from '../../slices/store'
import { CategoryItem } from './CategoryItem'
import { modalContext } from '../ModalContext'
import { FormFieldsType, FormType } from '../utils/types'
import { DeepPartial } from 'react-hook-form'
import { createCategoryThunk, updateCategoryThunk } from '../../slices/categoriesSlice'
type asd = { name: string }

export const Categories = () => {
    const categories = useAppSelector(state => state.categories.items)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const dispatch = useAppDispatch()

    const { openModal } = useContext(modalContext)

    const className = 'categories' + (siderCollapsed ? ' hidden' : '')

    const fields: FormFieldsType<asd> = {
        name: {
            options: {
                required: 'True',
            },
        },
    }

    const modalProps: FormType<asd> = {
        fields,
        onSubmit: async data => {
            await dispatch(createCategoryThunk(data.name))
        },
    }

    return (
        <div className={className}>
            Categories:
            {categories.map(item => (
                <CategoryItem key={item.id} {...item} />
            ))}
            <button
                onClick={() => {
                    openModal(modalProps)
                }}
            >
                Новая Категория
            </button>
        </div>
    )
}
