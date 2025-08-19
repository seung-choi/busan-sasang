import { useCallback, useEffect, useRef } from 'react';
import * as Px from '@plug/engine/src';
import { useAssetStore } from '../../store/assetStore';
import useEventStore from '@plug/v1/app/stores/eventSourceStore';
import type { 
  BaseFeature, 
  EngineEventHandlers, 
  EngineIntegrationConfig, 
  EngineIntegrationResult 
} from './types';
import type { Label3DImportOption, PoiImportOption } from '@plug/engine/src/interfaces';
import { TrainData } from '@plug/v1/app/view/types/stream';

interface UseEngineIntegrationProps {
  features: BaseFeature[] | null;
  handlers: EngineEventHandlers;
  config?: EngineIntegrationConfig;
}

const defaultConfig: EngineIntegrationConfig = {
  includeUnassignedDevices: true,
  enableTransformEdit: false,
  autoLoadHierarchy: false,
  defaultFloor: "0",
};

export const useEngineIntegration = ({
  features,
  handlers,
  config = {},
}: UseEngineIntegrationProps): EngineIntegrationResult => {
  const finalConfig = { ...defaultConfig, ...config };
  const eventListenersRef = useRef<Array<{ event: string; handler: (...args: unknown[]) => void }>>([]);
  const isModelLoadedRef = useRef(false);

  const { ttcData } = useEventStore();

  useEffect(() => {

    ttcData.forEach((ttc: TrainData) => {

      const id = `${ttc.line}_${ttc.trainDirection === '상행' ? 'UP' : 'DOWN'}_SUBWAY`;

      if(ttc.opCode === '열차 접근') {
        Px.Subway.Show(id);
        Px.Subway.DoEnter(id, 5, () => {});
      } else if(ttc.opCode === '출발') {
        Px.Subway.DoExit(id, 5, () => {
            Px.Subway.Hide(id);
        });
      } else if(ttc.opCode === '도착') {

        return;
      }
    });

  }, [ttcData]);

  const poiClickListener = useCallback((event: { target: PoiImportOption }) => {
    if (event.target && handlers.onPoiClick) {
      handlers.onPoiClick(event.target);
    }
  }, [handlers]);  
  
  const poiTransformListener = useCallback(async (event: { target: PoiImportOption }) => {
    if (event.target && handlers.onPoiTransformChange) {
      try {
        await handlers.onPoiTransformChange(event.target);
      } catch {
        // Ignore transform update errors
      }
    }
  }, [handlers]);

  const label3DTransformListener = useCallback(async (event: { target: Label3DImportOption }) => {
    if (event.target && handlers.onLabel3DTransformChange) {
      try {
        console.log('Label3D Transform Change:', event.target);
        await handlers.onLabel3DTransformChange(event.target);
      } catch {
        // Ignore transform update errors
      }
    }
  }, [handlers]);

  const poiDeleteClickListener = useCallback((event: { target: PoiImportOption }) => {
    if (event.target && handlers.onPoiDeleteClick) {
      handlers.onPoiDeleteClick(event.target);
    }  }, [handlers]);

  const changeEngineFloor = useCallback((floorId: string) => {
    try {      
      Px.Model.HideAll();
      Px.Model.Show(floorId);
    } catch {
      throw new Error(`Failed to change floor in engine: ${floorId}`);
    }
  }, []);

  const handleFloorChange = useCallback((floorId: string) => {
    try {
      changeEngineFloor(floorId);
      if (handlers.onFloorChange) {
        handlers.onFloorChange(floorId);
      }
    } catch {
      // Floor change failed, but continue execution
    }
  }, [changeEngineFloor, handlers]);

  const handleFeatureData = useCallback(() => {
    const currentAssets = useAssetStore.getState().assets;
    
    if (features && currentAssets.length > 0) {
      const filteredFeatures = finalConfig.includeUnassignedDevices 
        ? features
        : features.filter(feature => feature.deviceId !== null);

      const poiData = filteredFeatures.map((feature) => {
        const modelUrl = currentAssets.find(asset => asset.id === feature.assetId)?.file?.url || '';
        const poi: PoiImportOption = {
          id: feature.id, 
          iconUrl: '', 
          modelUrl: modelUrl,
          displayText: feature.deviceName ? feature.deviceName : '장비 할당 필요',
          floorId: feature.floorId,
          property: {
            deviceId: feature.deviceId || '',
          },
          position: feature.position,
          rotation: feature.rotation,
          scale: feature.scale
        };
        
        return poi;
      });

      Px.Poi.Import(JSON.stringify(poiData));
    }  }, [features, finalConfig.includeUnassignedDevices]);

  const removeEventListeners = useCallback(() => {
    eventListenersRef.current.forEach(({ event, handler }) => {      try {
        Px.Event.RemoveEventListener(event, handler);
      } catch {
        // Ignore cleanup errors
      }
    });
    eventListenersRef.current = [];
  }, []);

  const addEngineEventListeners = useCallback(() => {
    removeEventListeners();    
    
    if (handlers.onPoiDeleteClick) {
      Px.Event.AddEventListener("onPoiPointerUp", poiDeleteClickListener);
      eventListenersRef.current.push({ event: "onPoiPointerUp", handler: poiDeleteClickListener as (...args: unknown[]) => void });
    } else if (handlers.onPoiClick) {
      Px.Event.AddEventListener("onPoiPointerUp", poiClickListener);
      eventListenersRef.current.push({ event: "onPoiPointerUp", handler: poiClickListener as (...args: unknown[]) => void });
    }

    if (finalConfig.enableTransformEdit && handlers.onPoiTransformChange) {
      Px.Event.AddEventListener('onPoiTransformChange', poiTransformListener);
      eventListenersRef.current.push({ event: 'onPoiTransformChange', handler: poiTransformListener as (...args: unknown[]) => void });
    }

    if (handlers.onLabel3DTransformChange) {
      Px.Event.AddEventListener('onLabel3DTransformChange', label3DTransformListener);
      eventListenersRef.current.push({ event: 'onLabel3DTransformChange', handler: label3DTransformListener as (...args: unknown[]) => void });
    }


  
  }, [handlers, finalConfig.enableTransformEdit, poiClickListener, poiTransformListener, label3DTransformListener, poiDeleteClickListener, removeEventListeners]);

  useEffect(() => {
    if (!isModelLoadedRef.current) return;

    addEngineEventListeners();
  }, [handlers.onPoiClick, handlers.onPoiTransformChange, handlers.onPoiDeleteClick, handlers.onFloorChange, handlers.onHierarchyLoaded, addEngineEventListeners]);
  
  const handleModelLoaded = useCallback(async () => {    isModelLoadedRef.current = true;
    
    handleFeatureData();

    if (finalConfig.autoLoadHierarchy && handlers.onHierarchyLoaded) {
      const modelHierarchy = Px.Model.GetModelHierarchy();
      if (modelHierarchy) {
        handlers.onHierarchyLoaded(modelHierarchy);
        if (finalConfig.defaultFloor) {
          handleFloorChange(finalConfig.defaultFloor);
        }
      }
    }
    addEngineEventListeners();
  }, [handleFeatureData, finalConfig.autoLoadHierarchy, finalConfig.defaultFloor, handlers, handleFloorChange, addEngineEventListeners]);

  const refreshPoiData = useCallback(() => {
    handleFeatureData();  }, [handleFeatureData]);
  
  useEffect(() => {
    return () => {
      removeEventListeners();
    };
  }, [removeEventListeners]);

  return {
    handleModelLoaded,
    handleFloorChange,
    refreshPoiData,
  };
};
