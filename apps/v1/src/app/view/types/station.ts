export interface FileResponse {
  id: number;
  url: string;
  originalFileName: string;
  contentType: string;
  fileStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: number;
  name: string;
  description: string;
  drawing: FileResponse;
  thumbnail: FileResponse;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
}


export interface FeatureResponse {
  id: string;
  deviceId: string | null;
  deviceName?: string;
  assetId: number;
  floorId: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface Label3D {
  id: string;
  floorId: string;
  displayText: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
}

export interface Floor {
  name: string;
  floorId: string;
}

export interface StationWithFeatures {
  facility: Facility;
  features: FeatureResponse[];
  label3Ds: Label3D[];
  floors: Floor[];
  lineId: number;  
  route: string;
  subway: string;
  externalCode: string;
}