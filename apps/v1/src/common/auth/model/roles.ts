export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export type RoleType = keyof typeof Role;

export const ROUTE_CONFIG = {
    [Role.ADMIN]: {
        defaultRedirect: '/admin/dashboard'
    },
    [Role.USER]: {
        defaultRedirect: '/service'
    }
} as const;

export const ALLOWED_ROLES = Object.values(Role);

export function isValidSystemRole(role: string): role is Role {
    return ALLOWED_ROLES.includes(role as Role);
}

export function getRolePermissions(roles: string[]): Role[] {
    return roles.filter(isValidSystemRole);
}