import { api } from '@plug/api-hooks';
import type { DataResponseBody } from '@plug/api-hooks';
import {SignInRequest, SignUpRequest, UserProfile} from "@plug/common-services/types";


export const signUp = async (data: SignUpRequest) => {
  const response = await api.post('auth/sign-up', data, { requireAuth: false });
  return response;
};

export const signIn = async (data: SignInRequest): Promise<Response> => {
  const response = await api.post('auth/sign-in', data, { requireAuth: false });
  return response;
};

export const signOut = async (): Promise<Response> => {
  return api.post('auth/sign-out', {}, { requireAuth: true });
};

export const getUserProfile = (): Promise<DataResponseBody<UserProfile>> => {
  return api.get<UserProfile>('users/me', { requireAuth: true });
};
