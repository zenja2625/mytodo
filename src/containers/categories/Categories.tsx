import { useAppSelector } from '../../slices/store'
import { CategoryItem } from './CategoryItem'

export const Categories = () => {
    const categories = useAppSelector(state => state.categories.items)
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const className = 'categories' + (siderCollapsed ? ' hidden' : '')

    return (
        <div className={className}>
            Categories:
            {categories.map(item => (
                <CategoryItem key={item.id} {...item} />
            ))}
        </div>
    )
}
