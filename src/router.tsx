import { createBrowserRouter } from 'react-router-dom'
import { App } from './App'
import { Main } from './containers/Main'
import { NotFoundPage } from './containers/NotFoundPage'
import { Login } from './containers/account/Login'
import { Register } from './containers/account/Register'
import { NavigateCategoryId } from './containers/utils/NavigateCategoryId'
import { RedirectAuth } from './containers/utils/RedirectAuth'
import { RequireAuth } from './containers/utils/RequireAuth'

export const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                element: <RedirectAuth />,
                children: [
                    {
                        path: '/login',
                        element: <Login />,
                    },
                    {
                        path: '/register',
                        element: <Register />,
                    },
                ],
            },
            {
                element: <RequireAuth />,
                children: [
                    {
                        element: <NavigateCategoryId />,
                        children: [
                            { path: '/', element: <Main /> },
                            { path: '/category/:categoryId', element: <Main /> },
                        ],
                    },
                ],
            },
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
])
