import { Categories } from '../containers/categories/Categories'
import { TodosWrapper } from '../containers/todos/TodosWrapper'
import Box from '@mui/material/Box'

export const Main = () => (
    <Box component='main' display='flex' flexGrow={1}>
        <Categories />
        <TodosWrapper />
    </Box>
)
