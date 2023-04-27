import { FC, useCallback } from 'react'
import { Category } from '../../slices/sliceTypes'
import { useNavigate } from 'react-router-dom'

export const CategoryItem: FC<Category> = ({ id, name }) => {
    const navigate = useNavigate()

    const onClick = useCallback(() => {
        navigate(`/category/${id}`)
    }, [id, navigate])

    return (
        <div onClick={onClick}>
            {name}
            <button>Menu</button>
        </div>
    )
}
