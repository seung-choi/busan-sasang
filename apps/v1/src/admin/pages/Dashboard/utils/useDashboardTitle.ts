import { DASHBOARD_TITLES } from '../constants/DashboardTitle';
import { useLocation } from "react-router-dom";

export interface DashboardTitle{
    path: string;
    title: string;
}

export const DashboardTitle = () => {
    const location = useLocation();
    return DASHBOARD_TITLES.find(
        (item) => location.pathname.toLowerCase().includes(item.path.toLowerCase())
    )?.title;
};