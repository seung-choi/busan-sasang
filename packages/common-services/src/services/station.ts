import {
  BaseResponseBody,
  CreatedResponseBody,
  useDelete,
  useGet,
  usePatch,
  usePost,
  useSWRApi
} from "@plug/api-hooks";
import type { Station } from '@plug/common-services/types';
import {StationCreateRequest, StationDetail, StationUpdateRequest} from "../types";

const STATION_API = `stations`;

// 역할 목록 조회
export const useStations = () => {
  return useGet<Station[]>(STATION_API, { requireAuth: true });
};

// 역할 상세 조회
export const useStationDetail = (id: number) => {
  return useGet<Station>(`${STATION_API}/${id}`, { requireAuth: true });
};

export const useCreateStation = () => {
  return usePost<CreatedResponseBody, StationCreateRequest>(STATION_API, { requireAuth: true });
};

export const useUpdateStation = (stationId: number) => {
  return usePatch<BaseResponseBody, StationUpdateRequest>(`${STATION_API}/${stationId}`, { requireAuth: true });
};

export const useDeleteStation = (stationId: number) => {
  return useDelete(`${STATION_API}/${stationId}`, { requireAuth: true });
};

// SWR 기반 역할 목록 조회
export const useStationsSWR = () => {
  return useSWRApi<Station[]>(STATION_API, 'GET', { requireAuth: true });
};

// SWR 기반 역할 상세 조회
export const useStationDetailSWR = (id: number) => {
  return useSWRApi<StationDetail>(`${STATION_API}/${id}`, 'GET', { requireAuth: true });
};