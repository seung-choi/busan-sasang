import { useMemo } from 'react';
import { useEngineIntegration as useBaseEngineIntegration } from '@plug/v1/common/libs/engine';
import type { PoiImportOption } from '@plug/engine/dist/src/interfaces';
import type { FeatureResponse as Feature } from '@plug/v1/app/view/types/station';
import type { EngineEventHandlers, EngineIntegrationConfig } from '@plug/v1/common/libs/engine';

interface UseEngineIntegrationProps {
  features: Feature[] | null;
  onPoiSelect?: (poi: PoiImportOption) => void;
}

export function useEngineIntegration({
  features,
  onPoiSelect,
}: UseEngineIntegrationProps) {  const handlers: EngineEventHandlers = useMemo(() => ({
    onPoiClick: (poi: PoiImportOption) => {
      if (onPoiSelect) {
        onPoiSelect(poi);
      }
    },
  }), [onPoiSelect]);
  const config: EngineIntegrationConfig = useMemo(() => ({
    includeUnassignedDevices: false,
    enableTransformEdit: false,
    autoLoadHierarchy: false,
    defaultFloor: undefined,
  }), []);

  const { handleModelLoaded, handleFloorChange, refreshPoiData } = useBaseEngineIntegration({
    features,
    handlers,
    config,
  });
  return {
    handleModelLoaded,
    handleFloorChange,
    refreshPoiData,
  };
}
