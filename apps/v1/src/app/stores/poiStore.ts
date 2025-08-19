import { create } from 'zustand';
import type { PoiImportOption } from '@plug/engine/src/interfaces';

interface PoiStoreState {
  pendingPoiData: PoiImportOption[];
  setPendingPoiData: (data: PoiImportOption[]) => void;
  clearPendingPoiData: () => void;
}

const usePoiStore = create<PoiStoreState>((set) => ({
  pendingPoiData: [],
  setPendingPoiData: (data) => set({ pendingPoiData: data }),
  clearPendingPoiData: () => set({ pendingPoiData: [] }),
}));

export default usePoiStore;
