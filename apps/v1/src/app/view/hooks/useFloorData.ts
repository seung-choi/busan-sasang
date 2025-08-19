import { useMemo } from 'react';
import type { StationWithFeatures } from '../types/station';
import type { FloorItem } from '@plug/v1/app/view/map/types';

interface UseFloorDataReturn {
    floorItems: FloorItem[];
    modelPath: string;
}

export const useFloorData = (stationData: StationWithFeatures | null): UseFloorDataReturn => {
    const floorItems = useMemo((): FloorItem[] => {
        if (!stationData?.floors) return [];
        
        return stationData.floors.map((floor, index) => ({
            floorId: floor.floorId,
            displayName: floor.name,
            objectName: floor.floorId,
            sortingOrder: index,
        }));
    }, [stationData?.floors]);

    const modelPath = useMemo(() => {
        return stationData?.facility?.drawing?.url || '';
    }, [stationData?.facility?.drawing?.url]);

    return {
        floorItems,
        modelPath,
    };
};
