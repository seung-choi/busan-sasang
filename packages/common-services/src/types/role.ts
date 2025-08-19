export interface RoleCreateRequest {
    name: string;
    description: string;
}

export interface RoleUpdateRequest {
    name: string;
    description: string;
}

export interface RoleResponse {
    id: number;
    name: string;
    description: string;
}