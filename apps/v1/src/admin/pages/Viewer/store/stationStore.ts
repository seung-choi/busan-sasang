import { create } from 'zustand';

interface StationState {
  currentStationId: string | null;
  setStationId: (id: string) => void;
}

export const useStationStore = create<StationState>((set) => ({
  currentStationId: null, 
  setStationId: (id) => set({ currentStationId: id }),
}));
