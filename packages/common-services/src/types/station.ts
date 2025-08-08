import {Facility, Floor} from "./facility";

export interface Station {
  facility: Facility;
  floors: Floor[];
  lineIds: number[];
  route: string;
}

export interface StationDetail extends Station {
  features: Feature[];
  externalCode: string;
}

export interface StationCreateRequest {
  facility: {
    name: string;
    code: string;
    description: string;
    drawingFileId?: number | null;
    thumbnailFileId?: number | null;
  },
  floors: {
    name: string;
    floorId: string;
  }[],
  lineIds: number[],
  externalCode: string;
}

export interface StationFormValues {
  name: string;
  description: string;
  code: string;
  lineIds: number[];
  updatedBy: string;
  id: string;
  updatedAt: string;
  floors: Array<{ name: string; floorId: string }>;
  externalCode: string;
}

export interface StationUpdateRequest extends Omit<StationCreateRequest, 'route'> {
  id: number;
}

export interface Feature {
  name: string;
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
}