import { create } from 'zustand';

export interface StationState {
  stationCode: string;
  externalCode: string;
  currentFloor: string;
  setStationCode: (code: string) => void;
  setExternalCode: (code: string | undefined) => void;
  setCurrentFloor: (floorId: string) => void;
}

const useStationStore = create<StationState>((set) => ({
  stationCode: '',
  externalCode: '1_STATION_SM',
  currentFloor: 'ALL',
  setStationCode: (code) => set({ stationCode: code }),
  setExternalCode: (code) => set({ externalCode: code}),
  setCurrentFloor: (floorId) => set({ currentFloor: floorId }),
}));

export default useStationStore;
