import type { PoiImportOption, ModelInfo, Label3DImportOption } from '@plug/engine/src/interfaces';

export interface BaseFeature {
  id: string;
  deviceId: string | null;
  deviceName?: string;
  assetId: number;
  floorId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface EngineEventHandlers {
  onPoiClick?: (poi: PoiImportOption) => void;
  onPoiTransformChange?: (poi: PoiImportOption) => Promise<void>;
  onLabel3DTransformChange?: (label3D: Label3DImportOption) => Promise<void>;
  onPoiDeleteClick?: (poi: PoiImportOption) => void;
  onFloorChange?: (floorId: string) => void;
  onHierarchyLoaded?: (hierarchy: ModelInfo[]) => void;
}

export interface EngineIntegrationConfig {
  includeUnassignedDevices?: boolean;
  enableTransformEdit?: boolean;
  autoLoadHierarchy?: boolean;
  defaultFloor?: string;
}

export interface EngineIntegrationResult {
  handleModelLoaded: () => Promise<void>;
  handleFloorChange: (floorId: string) => void;
  refreshPoiData: () => void;
}
