import { useMemo } from 'react';
import { useEngineIntegration as useBaseEngineIntegration } from '../../../../common/libs/engine';
import type { PoiImportOption, Label3DImportOption, ModelInfo } from '@plug/engine/src/interfaces';
import type { EngineEventHandlers, EngineIntegrationConfig } from '../../../../common/libs/engine';
import type { FeatureResponse as Feature } from '@plug/v1/admin/pages/Viewer/types/station';
import { useFeatureApi } from './useFeatureApi';

interface UseEngineIntegrationProps {
  features: Feature[] | null;
  onPoiSelect: (poi: PoiImportOption) => void;
  onHierarchyLoaded: (hierarchy: ModelInfo[]) => void;
  onFloorChange: (floorId: string) => void;
  onPoiDeleteClick?: (poi: PoiImportOption) => void;
}

export function useEngineIntegration({
  features,
  onPoiSelect,
  onHierarchyLoaded,
  onFloorChange,
  onPoiDeleteClick,
}: UseEngineIntegrationProps) {

  const { updateTransform } = useFeatureApi();
  const handlers: EngineEventHandlers = useMemo(() => ({

    onPoiClick: onPoiDeleteClick ? undefined : (poi: PoiImportOption) => {
      console.log('POI clicked:', poi);
      onPoiSelect(poi);
    },

    onPoiDeleteClick: onPoiDeleteClick ? (poi: PoiImportOption) => {
      console.log('POI delete clicked:', poi);
      onPoiDeleteClick(poi);
    } : undefined,

    onLabel3DTransformChange: async (label3D: Label3DImportOption) => {
      try {
        await updateTransform(label3D.id, {
          position: label3D.position,
          rotation: label3D.rotation,
          scale: label3D.scale
        });
      } catch (error) {
        console.error('Failed to update Label3D transform:', error);
      }
    },
    onPoiTransformChange: async (poi: PoiImportOption) => {
      try {
        await updateTransform(poi.id, {
          position: poi.position,
          rotation: poi.rotation,
          scale: poi.scale
        });
      } catch (error) {
        console.error('Failed to update POI transform:', error);
      }
    },
    onFloorChange,
    onHierarchyLoaded,
  }), [onPoiSelect, onFloorChange, onHierarchyLoaded, onPoiDeleteClick, updateTransform]);

  // 관리자 전용 설정
  const config: EngineIntegrationConfig = useMemo(() => ({
    includeUnassignedDevices: true,
    enableTransformEdit: true,
    autoLoadHierarchy: true,
    defaultFloor: "0",
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
