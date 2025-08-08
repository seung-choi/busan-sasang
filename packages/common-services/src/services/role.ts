import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { RoleResponse, RoleCreateRequest, RoleUpdateRequest } from '@plug/common-services';

const ROLE_API = `roles`;

// 역할 목록 조회
export const useRoles = () => {
  return useGet<RoleResponse[]>(ROLE_API, { requireAuth: true });
};

// 역할 상세 조회
export const useRoleDetail = (roleId: number) => {
  return useGet<RoleResponse>(`${ROLE_API}/${roleId}`, { requireAuth: true });
};

// 역할 생성 
export const useCreateRole = () => {
  return usePost<CreatedResponseBody, RoleCreateRequest>(ROLE_API, { requireAuth: true });
};

// 역할 수정
export const useUpdateRole = (roleId: number) => {
  return usePut<BaseResponseBody, RoleUpdateRequest>(`${ROLE_API}/${roleId}`, { requireAuth: true });
};

//역할 삭제
export const useDeleteRole = (roleId: number) => {
  return useDelete(`${ROLE_API}/${roleId}`, { requireAuth: true });
};

// SWR 기반 역할 목록 조회
export const useRolesSWR = () => {
  return useSWRApi<RoleResponse[]>(ROLE_API, 'GET', { requireAuth: true });
};

// SWR 기반 역할 상세 조회
export const useRoleDetailSWR = (roleId: number) => {
  return useSWRApi<RoleResponse>(`${ROLE_API}/${roleId}`, 'GET', { requireAuth: true });
};