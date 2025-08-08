import { create } from 'zustand';
import { EventData, ShutterData, TrainData } from '../modules/view/types/stream';

interface EventStore {
  ttcData: TrainData[];
  eventData: EventData[];
  shutterData: ShutterData[];
  setTtcData: (data: TrainData[]) => void;
  setEventData: (data: EventData[]) => void;
  setShutterData: (data: ShutterData[]) => void;
}

const useEventStore = create<EventStore>((set) => ({
  ttcData: [],
  eventData: [],
  shutterData: [],
  setTtcData: (data) => set(() => ({ ttcData: [...data] })),
  setEventData: (data) => set((state) => ({ eventData: [...state.eventData, ...data] })),
  setShutterData: (data) => set((state) => ({ shutterData: [...state.shutterData, ...data] })),
}));

export default useEventStore;
