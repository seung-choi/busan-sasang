import { api } from '@plug/api-hooks';
import { useGet, usePost, usePut, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import { CategoryResponse, CategoryCreateRequest, CategoryUpdateResquest } from '@plug/common-services';

const CATEGORY_API = `device-categories`;

// 장비 분류 목록 조회
export const useCategories = () => {
    return useGet<CategoryResponse[]>(CATEGORY_API, { requireAuth: true });
}

// 장비 분류 상세 조회
export const useCategoryDetail = (categoryId: number) => {
    return useGet<CategoryResponse>(`${CATEGORY_API}/${categoryId}`, { requireAuth: true });
}

// 장비 분류 삭제 
export const deleteCategory = async (categoryId: number) => {
    return await api.delete(`${CATEGORY_API}/${categoryId}`, { requireAuth: true });
}

// 장비 분류 생성
export const useCreateCategory = () => {
    return usePost<CreatedResponseBody, CategoryCreateRequest>(CATEGORY_API, { requireAuth: true });
}

// 장비 분류 수정
export const useUpdateCategory = (categoryId: number) => {
    return usePut<BaseResponseBody, CategoryUpdateResquest>(`${CATEGORY_API}/${categoryId}`, { requireAuth: true });
}

// 장비 분류 SWR 기반 목록 조회  
export const useCategoriesSWR = () => {
    return useSWRApi<CategoryResponse[]>(CATEGORY_API, 'GET', { requireAuth: true });
}

// 장비 분류 SWR 기반 상세 조회 
export const useCategoryDetailSWR = (categoryId: number) => {
    const key = categoryId ? `${CATEGORY_API}/${categoryId}` : '';
    return useSWRApi<CategoryResponse>(key, 'GET', { requireAuth: true });
}


