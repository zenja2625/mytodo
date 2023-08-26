import CircularProgress from '@mui/material/CircularProgress'
import { useLoadDelay } from '../../hooks/useLoadDelay'
import { useAppSelector } from '../../slices/store'

export const HeaderIndicator = () => {
    const requestCount = useAppSelector(state => state.app.requestCount)
    const showLoadIndicator = useLoadDelay(requestCount > 0, 500)

    return showLoadIndicator ? <CircularProgress color='inherit' size={25} /> : <></>
}
