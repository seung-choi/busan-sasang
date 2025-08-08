import { api } from '@plug/api-hooks';
import { useGet, usePost, usePatch, useSWRApi, usePut } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { UserResponse, UserCreateRequest, UserUpdateRequest, UserUpdatePasswordRequest } from '@plug/common-services';

const USER_API = `admin/users`;

// 사용자 목록 조회
export const useUsers = () => {
  return useGet<UserResponse[]>(USER_API, { requireAuth: true });
};

// 로그인된 사용자 정보 조회
export const useUserLoggedIn = () => {
  return useGet<UserResponse>(`${USER_API}/with-is-logged-in`, { requireAuth: true });
};

// 사용자 상세 조회
export const useUserDetail = (userId: number) => {
  return useGet<UserResponse>(`${USER_API}/${userId}`, { requireAuth: true });
};

// 사용자 생성
export const useCreateUser = () => {
  return usePost<CreatedResponseBody, UserCreateRequest>(USER_API, { requireAuth: true });
};

// 사용자 삭제
export const deleteUser = async (userId: number) => {
  return await api.delete(`${USER_API}/${userId}`, { requireAuth: true });
}

// 사용자 정보 수정
export const useUpdateUser = (userId: number) => {
  return usePatch<BaseResponseBody, UserUpdateRequest>(`${USER_API}/${userId}`, { requireAuth: true });
};

// 사용자 비밀번호 변경
export const useUpdateUserPassword = (userId: number) => {
  return usePatch<BaseResponseBody, UserUpdatePasswordRequest>(`${USER_API}/${userId}/password`, { requireAuth: true });
}

// SWR 기반 사용자 목록 조회
export const useUsersSWR = () => {
  return useSWRApi<UserResponse[]>(USER_API, 'GET', { requireAuth: true });
};

// SWR 기반 사용자 상세 조회
export const useUserDetailSWR = (userId: number) => {
  const key = userId ? `${USER_API}/${userId}` : '';
  return useSWRApi<UserResponse>(key, 'GET', { requireAuth: true });
};

// Admin user role 파트
// 사용자 역할 할당
export const useAssignUserRoles = (userId: number) => {
  return usePut<BaseResponseBody, { roleIds: number[] }>(`${USER_API}/${userId}/roles`, { requireAuth: true });
};

