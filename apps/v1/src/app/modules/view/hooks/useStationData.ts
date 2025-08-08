import { useState, useEffect, useCallback } from 'react';
import { api } from '@plug/api-hooks/core';
import type { StationWithFeatures } from '../types/station';

interface UseStationDataReturn {
    stationData: StationWithFeatures | null;
    stationLoading: boolean;
    error: Error | null;
    refetchStation: () => Promise<void>;
}

export const useStationData = (code: string): UseStationDataReturn => {
    const [stationData, setStationData] = useState<StationWithFeatures | null>(null);
    const [stationLoading, setStationLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchStationData = useCallback(async () => {
        if (!code) {
            setError(new Error('Invalid station ID'));
            setStationLoading(false);
            return;
        }
        
        try {
            setStationLoading(true);
            setError(null);
            const response = await api.get<StationWithFeatures>(`stations/by-code/${code}`);
            setStationData(response.data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch station data'));
            setStationData(null);
        } finally {
            setStationLoading(false);
        }
    }, [code]);

    useEffect(() => {
        fetchStationData();
    }, [fetchStationData]);

    return {
        stationData,
        stationLoading,
        error,
        refetchStation: fetchStationData,
    };
};
