import { FC, useCallback, useContext } from 'react'
import { Category } from '../../slices/sliceTypes'
import { useNavigate } from 'react-router-dom'
import { modalContext } from '../ModalContext'
import { FormFieldsType } from '../utils/types'
import { DeepPartial } from 'react-hook-form'

export const CategoryItem: FC<Category> = ({ id, name }) => {
    const navigate = useNavigate()
    const { openModal } = useContext(modalContext)

    const onClick = useCallback(() => {
        navigate(`/category/${id}`)
    }, [id, navigate])

    const asd: FormFieldsType<{ name: string }> = {
        name: {
            options: {
                required: 'True',
            },
        },
    }

    const defaultValues:
        | {
              name?: string | undefined
          }
        | undefined = {
        name,
    }

    return (
        <div onClick={onClick}>
            {name}
            <button
                onClick={() => {
                    openModal({
                        fields: asd,
                        onSubmit: data => {},
                        defaultValues: { name },
                    })
                }}
            >
                Edit
            </button>
        </div>
    )
}
