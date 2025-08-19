import { RouteObject, Navigate } from 'react-router-dom';
import {SERVICE_ROUTE} from "@plug/v1/router/service/ServiceRoutes";
import ViewerPage from "@plug/v1/app/view/pages/ViewerPage";

export const ServiceRouter: RouteObject[] = [
    {
        path: '/service',
        children: [
            { path: '', element: <Navigate to="/service/119" replace /> },
            { path: SERVICE_ROUTE.VIEWER, element: <ViewerPage/> }
        ],

    },
]