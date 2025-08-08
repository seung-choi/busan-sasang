import { create } from 'zustand';

export interface DeviceModalState {
  isOpen: boolean;
  title: string;
  deviceId: string | null;
  deviceType: string;
  stationId: string;
  openModal: (title: string, deviceId: string, deviceType: string, stationId: string) => void;
  closeModal: () => void;
}

const useDeviceModalStore = create<DeviceModalState>((set) => ({
  isOpen: false,
  title: '',
  deviceId: null,
  deviceType: '',
  stationId: '',
  openModal: (title, deviceId, deviceType, stationId) =>
    set({
      isOpen: true,
      title,
      deviceId,
      deviceType, 
      stationId,
    }),
  closeModal: () => 
    set({ 
      isOpen: false, 
      deviceId: null, 
      deviceType: '', 
      stationId: '',
      title: ''
    }),
}));

export default useDeviceModalStore;
