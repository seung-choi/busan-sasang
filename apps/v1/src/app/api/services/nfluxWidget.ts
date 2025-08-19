// NFlux Platform Widget A    const response = await client.get(`ventilation/machine/${fcltsId}`).json<VentilationMachineResponse>();I 서비스
import { createNfluxWidgetApiClient } from '../clients/nflux';
import type {
  LightGroup,
  ShutterGroup,
  VentilationMachine
} from '../types/nflux';

export const nfluxWidgetService = {
  // 조명 제어반(그룹) 조회
  getLightGroups: async (stationId: string): Promise<LightGroup[]> => {
    const client = createNfluxWidgetApiClient(undefined);
    // TODO api 엔드포인트 확인 하는 영역
    // return client.get(`lightGroups/${stationId}`).json<LightGroup[]>(); 원래, 아래는 테스트해보고 안되면 지금 주석 쓰기
    return client.get(`poi/widget/lightGroups/${stationId}`).json<LightGroup[]>();
  },

  // 셔터 제어반(그룹) 조회
  getShutterGroups: async (stationId: string): Promise<ShutterGroup[]> => {
    const client = createNfluxWidgetApiClient(undefined);
    // TODO api 엔드포인트 확인 하는 영역
    // return client.get(`shutterGroups/${stationId}`).json<ShutterGroup[]>(); 원래, 아래는 테스트해보고 안되면 지금 주석 쓰기
    return client.get(`poi/widget/shutterGroups/${stationId}`).json<ShutterGroup[]>();
  },

  // 환기설비 개별 조회
  getVentilationMachine: async (fcltsId: string): Promise<Record<string, VentilationMachine>> => {
    const client = createNfluxWidgetApiClient(undefined);
    return client.get(`ventilation/machine/${fcltsId}`).json<Record<string,VentilationMachine>>();
  }
};
