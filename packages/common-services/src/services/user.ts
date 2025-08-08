import { useGet, usePut, useSWRApi } from '@plug/api-hooks';
import type { BaseResponseBody } from '@plug/api-hooks';
import type { UserUpdateRequest, UserResponse } from '@plug/common-services';

const USER_ME_API = `/users/me`;

export const useUserMe = () => {
  return useGet<UserResponse>(USER_ME_API, { requireAuth: true });
};

export const useUpdateUserMe = () => {
  return usePut<BaseResponseBody, UserUpdateRequest>(`${USER_ME_API}`, { requireAuth: true });
};

export const useUserMeSWR = () => {
  return useSWRApi<UserResponse>(USER_ME_API, 'GET', { requireAuth: true });
};
