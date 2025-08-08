export interface MapViewerProps {
  modelPath: string;
  floors?: FloorItem[];
  onModelLoaded?: () => void;
  onLoadError?: (error: Error) => void;
}

export interface ModelInfo {
  url: string;
  name: string;
  format: 'gltf' | 'glb' | 'fbx';
}

export interface ViewerSettings {
  enableControls?: boolean;
  backgroundColor?: string;
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface FloorItem {
    objectName: string;
    displayName: string;
    sortingOrder: number;
    floorId: string;
}

export interface FloorSelectorProps {
  floors: FloorItem[];
  onFloorChange?: (floorId: string) => void;
}
