import { useState, useEffect } from 'react';
import { api } from '@plug/api-hooks';
import type { StationWithFeatures } from '../types';

interface UseStationResult {
  data: StationWithFeatures | null;
  isLoading: boolean;
  error: Error | null;
}

export function useStation(stationId: string | null): UseStationResult {
  const [data, setData] = useState<StationWithFeatures | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!stationId) {
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    const fetchStation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get<StationWithFeatures>(`stations/${stationId}/with-features`);
        
        if (!isCancelled) {
          setData(response.data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch station'));
          console.error('Error fetching station data:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchStation();

    return () => {
      isCancelled = true;
    };
  }, [stationId]);

  return { data, isLoading, error };
}
