import { FC, useCallback, useContext } from 'react'
import { Category } from '../../slices/sliceTypes'
import { useNavigate } from 'react-router-dom'
import { DeepPartial, DefaultValues } from 'react-hook-form'
import { useAppDispatch } from '../../slices/store'
import { deleteCategoryThunk, updateCategoryThunk } from '../../slices/categoriesSlice'
import { CategoryRequestDTO } from '../../api/apiTypes'

export const CategoryItem: FC<
    Category & {
        openEdit: (id: string, defaultValues: DeepPartial<CategoryRequestDTO>) => void
    }
> = ({ id, name, openEdit }) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // const { openModal } = useContext(modalContext)

    const onClick = useCallback(() => {
        navigate(`/category/${id}`)
    }, [id, navigate])

    // const fields: FormFieldsType<CategoryRequestDTO> = {
    //     name: {
    //         options: {
    //             required: 'True',
    //         },
    //     },
    // }
    // const defaultValues: DeepPartial<CategoryRequestDTO> = {
    //     name,
    // }

    // const modalProps: FormType<CategoryRequestDTO> = {
    //     fields,
    //     onSubmit: async data => {
    //         await dispatch(updateCategoryThunk({ id, ...data }))
    //     },
    //     defaultValues,
    // }

    return (
        <div onClick={onClick}>
            {name}
            <button
                onClick={() => {
                    openEdit(id, { name })
                    // openModal(modalProps)
                }}
            >
                Edit
            </button>
            <button
                onClick={() => {
                    const response = window.confirm('Remove this item')

                    if (response) dispatch(deleteCategoryThunk(id))
                }}
            >
                Remove
            </button>
        </div>
    )
}
