import { api } from '@plug/api-hooks';
import { useGet, usePost, usePatch, useSWRApi, usePut } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import { DeviceResponse, DeviceCreateRequest, DeviceUpdateRequest } from '@plug/common-services';

const DEVICE_API = `devices`;

// 장비 목록 조회 
export const useDevices = () => {
    return useGet<DeviceResponse[]>(DEVICE_API, { requireAuth: true })
}

// 장비 상세 조회
export const useDeviceDetail = (deviceId: string) => {
    return useGet<DeviceResponse>(`${DEVICE_API}/${deviceId}`, { requireAuth: true });
}

// 장비 삭제 
export const deleteDevice = async (deviceId: string) => {
    return await api.delete(`${DEVICE_API}/${deviceId}`, { requireAuth: true });
}

// 장비 생성
export const useCreateDevice = () => {
    return usePost<CreatedResponseBody, DeviceCreateRequest>(DEVICE_API, { requireAuth: true });
}

// 장비 수정
export const useUpdateDevice = (deviceId: string) => {
    return usePatch<BaseResponseBody, DeviceUpdateRequest>(`${DEVICE_API}/${deviceId}`, { requireAuth: true });
}

// 장비 SWR 기반 목록 조회 
export const useDevicesSWR = () => {
    return useSWRApi<DeviceResponse[]>(DEVICE_API, 'GET', { requireAuth: true });
}

// 장비 SWR 기반 상세 조회
export const useDeviceDetailSWR = (deviceId: string) => {
    const key = deviceId ? `${DEVICE_API}/${deviceId}` : '';
    return useSWRApi<DeviceResponse>(key, 'GET', { requireAuth: true });
}

// 장비에 피처 할당
export const useAssignDeviceFeature = (deviceId: string, featureId: string) => {
    return usePut<DeviceResponse>(`${DEVICE_API}/${deviceId}/feature/${featureId}`, { requireAuth: true });
};

// 장비에 카테고리 할당
export const useAssignDeviceCategory = (deviceId: string, categoryId: string) => {
    return usePut<DeviceResponse>(`${DEVICE_API}/${deviceId}/categories/${categoryId}`, { requireAuth: true });
};
