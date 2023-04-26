import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../slices/store'

export const Categories = () => {
    const navigate = useNavigate()

    const categories = useAppSelector(state => state.categories.items)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const className = 'categories' + (siderCollapsed ? ' hidden' : '')

    return (
        <div className={className}>
            Categories:
            {categories.map(item => (
                <div
                    onClick={() => {
                        navigate(`/category/${item.id}`)
                    }}
                    key={item.id}
                >
                    {item.name}
                </div>
            ))}
        </div>
    )
}
