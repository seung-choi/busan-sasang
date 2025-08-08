import { RoleResponse } from "./role";

export interface UserCreateRequest {
    username: string;
    password: string;
    name: string;
    code?: string;
    phoneNumber: string;
    department: string;
    roleIds?: number[];
}

export interface UserUpdateRequest {
    name: string;
    code?: string;
    phoneNumber: string;
    department: string;
    roleIds?: number[];
}

export interface UserResponse {
    id: number;
    username: string;
    name: string;
    code?: string;
    phoneNumber: string;
    department: string;
    roles: RoleResponse[];
}

export interface UserUpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
  }



