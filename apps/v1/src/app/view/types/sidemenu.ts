export interface DeviceData {
  id: string;
  name: string;
  code: string;
  feature: DeviceFeature;
}

export interface DeviceFeature {
  id: string;
  floorId: string;
  assetId: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
}

export interface Category{
  categoryId: number;
  categoryName: string;
  contextPath: string;
  iconFile: {url: string;};
  devices: DeviceData[];
}
export interface SideMenuItem {
  id: string;
  name: string;
  type: string;
  icon?: string;
  devices?: DeviceData[];
}
