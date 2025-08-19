import { Navigate, Outlet } from 'react-router-dom';
import { useProfileStore } from "@plug/v1/common/auth/controller/useProfileStore";
import { Role, RoleType, ROUTE_CONFIG, getRolePermissions } from "@plug/v1/common/auth/model/roles";

interface ProtectedRouteProps {
    requiredRoles?: Role[];
}

export const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
    const { user } = useProfileStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const userRoles = getRolePermissions(user.roles.map(role => role.name) as RoleType[]);
    
    if (!requiredRoles) {
        return <Outlet />;
    }

    const matchedRole = requiredRoles.find(role => userRoles.includes(role));
    
    if (!matchedRole) {
        const defaultRedirect = ROUTE_CONFIG[Role.USER].defaultRedirect;
        return <Navigate to={defaultRedirect} replace />;
    }

    return <Outlet />;
};