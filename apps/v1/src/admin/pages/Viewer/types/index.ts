
export interface FileResponse {
  id: number;
  url: string;
  originalFileName: string;
  contentType: string;
  fileStatus: string;
  createdAt: string;
  updatedAt: string;
}

export * from './asset';
export * from './station';