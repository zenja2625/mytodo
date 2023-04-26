import { useParams } from 'react-router-dom'

type ParamsType = {
    categoryId: string
}

export const Todos = () => {
    const { categoryId } = useParams<ParamsType>()

    return <div className='todos'>{categoryId || 'Take Category'}</div>
}
