import { api } from '@plug/api-hooks';
import { useGet, usePost, usePatch, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import { LineResponse, LineCreateRequest, LineUpdateResquest } from '@plug/common-services/types';

const LINE_API = `lines`;

// 호선 목록 조회
export const useLines = () => {
    return useGet<LineResponse[]>(LINE_API, {requireAuth: true});
}

// 호선 생성
export const useLineCreate = () => {
    return usePost<CreatedResponseBody, LineCreateRequest>(LINE_API, { requireAuth: true });
};

// 호선 상세 조회 
export const useLineDetail = (lineId: number) => {
    return useGet<LineResponse>(`${LINE_API}/${lineId}`, { requireAuth: true });
};

// 호선 삭제
export const deleteLine = async (lineId: number) => {
    return await api.delete(`${LINE_API}/${lineId}`, { requireAuth: true });
}

// 호선 수정
export const useLineUpdate = (lineId: number) => {
    return usePatch<BaseResponseBody, LineUpdateResquest>(`${LINE_API}/${lineId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useLinesSWR = () => {
    return useSWRApi<LineResponse[]>(LINE_API, 'GET', { requireAuth: true });
};

export const useLineDetailSWR = (lineId: number) => {
    const key = lineId ? `${LINE_API}/${lineId}` : '';
    return useSWRApi<LineResponse>(key, 'GET', { requireAuth: true });
};