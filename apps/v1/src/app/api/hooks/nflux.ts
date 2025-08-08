// NFlux API용 React 훅들
import { useState, useEffect, useCallback } from 'react';
import { nfluxService } from '../services/nflux';
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

// 공통 훅 타입
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// === 역사 기본 정보 조회 훅들 ===

// 역사 환경정보 조회
export const useStationEnv = (stationId: string): UseApiResult<StationEnv & { stationId: string; fcltsType: string }> => {
  const [data, setData] = useState<StationEnv & { stationId: string; fcltsType: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getStationEnv(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
    // 1분마다 업데이트
    const interval = setInterval(fetchData, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// 역사 이벤트 현황 조회
export const useStationEvents = (stationId: string): UseApiResult<StationEvents> => {
  const [data, setData] = useState<StationEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getStationEvents(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// === 역사별 시설물 정보 조회 훅들 ===

// 조명 정보 조회
export const useLights = (stationId: string): UseApiResult<Light[]> => {
  const [data, setData] = useState<Light[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getLights(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// 셔터 정보 조회
export const useShutters = (stationId: string): UseApiResult<Shutter[]> => {
  const [data, setData] = useState<Shutter[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getShutters(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
    // 30초마다 업데이트
    const interval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// CCTV 정보 조회
export const useCCTV = (stationId: string): UseApiResult<CCTV[]> => {
  const [data, setData] = useState<CCTV[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getCCTV(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// 화재수신기 정보 조회
export const useFireSensors = (stationId: string): UseApiResult<FireSensor[]> => {
  const [data, setData] = useState<FireSensor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getFireSensors(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// === 기계 설비 관련 ===
export const useElevators = (stationId: string): UseApiResult<Elevator[]> => {
  const [data, setData] = useState<Elevator[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getElevators(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useEscalators = (stationId: string): UseApiResult<Escalator[]> => {
  const [data, setData] = useState<Escalator[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getEscalators(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useWaterTanks = (stationId: string): UseApiResult<WaterTank[]> => {
  const [data, setData] = useState<WaterTank[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getWaterTanks(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useCatchpits = (stationId: string): UseApiResult<Catchpit[]> => {
  const [data, setData] = useState<Catchpit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getCatchpits(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useAirPurifiers = (stationId: string): UseApiResult<AirPurifier[]> => {
  const [data, setData] = useState<AirPurifier[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      const result = await nfluxService.getAirPurifiers(stationId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// === 제어 관련 훅들 ===

// 조명 제어 훅
export const useLightControl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controlLight = useCallback(async (request: ControlRequest): Promise<ControlResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await nfluxService.controlLights(request);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { controlLight, loading, error };
};

// 셔터 제어 훅
export const useShutterControl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controlShutter = useCallback(async (request: ControlRequest): Promise<ControlResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await nfluxService.controlShutters(request);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { controlShutter, loading, error };
};

// === 통합 역사 정보 조회 훅 (모든 정보를 한번에) ===
export interface StationFacilities {
  env: StationEnv & { stationId: string; fcltsType: string };
  events: StationEvents;
  lights: Light[];
  shutters: Shutter[];
  cctv: CCTV[];
  fireSensors: FireSensor[];
  elevators: Elevator[];
  escalators: Escalator[];
  waterTanks: WaterTank[];
  catchpits: Catchpit[];
  airPurifiers: AirPurifier[];
}

export const useStationFacilities = (stationId: string): UseApiResult<StationFacilities> => {
  const [data, setData] = useState<StationFacilities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!stationId) return;
    
    try {
      setLoading(true);
      
      const [
        envResult,
        eventsResult,
        lightsResult,
        shuttersResult,
        cctvResult,
        fireSensorsResult,
        elevatorsResult,
        escalatorsResult,
        waterTanksResult,
        catchpitsResult,
        airPurifiersResult
      ] = await Promise.all([
        nfluxService.getStationEnv(stationId),
        nfluxService.getStationEvents(stationId),
        nfluxService.getLights(stationId),
        nfluxService.getShutters(stationId),
        nfluxService.getCCTV(stationId),
        nfluxService.getFireSensors(stationId),
        nfluxService.getElevators(stationId),
        nfluxService.getEscalators(stationId),
        nfluxService.getWaterTanks(stationId),
        nfluxService.getCatchpits(stationId),
        nfluxService.getAirPurifiers(stationId)
      ]);

      setData({
        env: envResult,
        events: eventsResult,
        lights: lightsResult,
        shutters: shuttersResult,
        cctv: cctvResult,
        fireSensors: fireSensorsResult,
        elevators: elevatorsResult,
        escalators: escalatorsResult,
        waterTanks: waterTanksResult,
        catchpits: catchpitsResult,
        airPurifiers: airPurifiersResult
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
