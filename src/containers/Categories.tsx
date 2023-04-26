import { CSSProperties, useMemo } from 'react'
import { useAppSelector } from '../slices/store'

export const Categories = () => {
    const siderCollapsed = useAppSelector(state => state.app.siderCollapsed)

    const className = 'categories' + (siderCollapsed ? ' hidden' : '')

    return <div className={className}>Category</div>
}
