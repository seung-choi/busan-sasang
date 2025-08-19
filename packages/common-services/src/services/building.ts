import { useGet, usePost, usePut, useDelete, useSWRApi } from '@plug/api-hooks';
import type { CreatedResponseBody, BaseResponseBody } from '@plug/api-hooks';
import type { BuildingResponse, BuildingCreateRequest, BuildingUpdateRequest } from '@plug/common-services';

const BUILDINGS_API = `/buildings`;

export const useBuildings = () => {
  return useGet<BuildingResponse[]>(BUILDINGS_API, { requireAuth: true });
};

export const useBuildingDetail = (buildingId: number) => {
  return useGet<BuildingResponse>(`${BUILDINGS_API}/${buildingId}`, { requireAuth: true } );
};

export const useCreateBuilding = () => {
  return usePost<CreatedResponseBody, BuildingCreateRequest>(BUILDINGS_API, { requireAuth: true });
};

export const useUpdateBuilding = (buildingId: number) => {
  return usePut<BaseResponseBody, BuildingUpdateRequest>(`${BUILDINGS_API}/${buildingId}`, { requireAuth: true });
};

export const useDeleteBuilding = (buildingId: number) => {
  return useDelete(`${BUILDINGS_API}/${buildingId}`, { requireAuth: true });
};

// SWR 기반 훅
export const useBuildingsSWR = () => {
  return useSWRApi<BuildingResponse[]>(BUILDINGS_API, 'GET', { requireAuth: true });
};

export const useBuildingDetailSWR = (buildingId: number) => {
  return useSWRApi<BuildingResponse>(`${BUILDINGS_API}/${buildingId}`, 'GET', { requireAuth: true });
};