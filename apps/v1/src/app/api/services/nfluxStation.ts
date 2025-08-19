// NFlux Platform Station API 서비스
import { createNfluxApiClient } from '../clients/nflux';
import type {
  Light,
  Shutter,
  CCTV,
  FireSensor,
  Elevator,
  Escalator,
  WaterTank,
  Catchpit,
  AirPurifier,
  StationEnv,
  StationEvents,
  ControlRequest,
  ControlResponse
} from '../types/nflux';

export const nfluxStationService = {
  // === 역사 기본 정보 ===
  // 역사 환경정보
  getStationEnv: async (stationId: string): Promise<StationEnv & { stationId: string; fcltsType: string }> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('env').json();
  },

  // 역사 이벤트 현황
  getStationEvents: async (stationId: string): Promise<StationEvents> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('events').json();
  },

  // === 역사별 시설물 정보 조회 ===
  // 조명 정보
  getLights: async (stationId: string): Promise<Light[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('lights').json();
  },

  // 셔터 정보
  getShutters: async (stationId: string): Promise<Shutter[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('shutters').json();
  },

  // 역사 CCTV 정보
  getCCTV: async (stationId: string): Promise<CCTV[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('cctv').json();
  },

  // 화재수신기 정보
  getFireSensors: async (stationId: string): Promise<FireSensor[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('fire-sensors').json();
  },

  // 엘리베이터 정보
  getElevators: async (stationId: string): Promise<Elevator[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('elevators').json();
  },

  // 에스컬레이터 정보
  getEscalators: async (stationId: string): Promise<Escalator[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('escalators').json();
  },

  // 물탱크 정보(급수탱크/소방탱크)
  getWaterTanks: async (stationId: string): Promise<WaterTank[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('waterTanks').json();
  },

  // 집수정 정보(오수조/배수조)
  getCatchpits: async (stationId: string): Promise<Catchpit[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('catchpits').json();
  },

  // 공기청정기 정보
  getAirPurifiers: async (stationId: string): Promise<AirPurifier[]> => {
    const client = createNfluxApiClient(undefined, stationId);
    return client.get('airPurifiers').json();
  },

  // === 제어 기능 ===
  // 조명 제어
  controlLights: async (request: ControlRequest): Promise<ControlResponse> => {
    const client = createNfluxApiClient();
    return client.post('poi/widget/lights/control', { json: request }).json();
  },

  // 셔터 제어
  controlShutters: async (request: ControlRequest): Promise<ControlResponse> => {
    const client = createNfluxApiClient();
    return client.post('poi/widget/shutters/control', { json: request }).json();
  }
};
