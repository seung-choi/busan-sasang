import type { FileResponse } from './index'

export interface Asset {
  id: number;
  name: string;
  code: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categoryCode: string | null;
  file: FileResponse;
  thumbnailFile: FileResponse;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Spatial {
  x: number;
  y: number;
  z: number;
}

export interface FeatureRequest {
  id: string;
  code: string;
  assetId: number;
  position: Spatial,
  rotation: Spatial,
  scale: Spatial,
}

