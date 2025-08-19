import { RouteObject } from 'react-router-dom';
import LoginPage from "@plug/v1/common/auth/view/LoginPage";

export const AppRouter: RouteObject[] = [
    {
        path: '/', element: <LoginPage/>
    }
]