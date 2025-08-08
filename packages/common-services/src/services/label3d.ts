import { api } from '@plug/api-hooks';
import { Label3DResponse, Label3DCreateRequest, Label3DUpdateRequest } from '../types/label3d';

export const label3dService = {
  get: async (id: string): Promise<Label3DResponse> => {
    const response = await api.get<Label3DResponse>(`label-3d/${id}`);
    return response.data;
  },

  getList: async (facilityId: number): Promise<Label3DResponse[]> => {
    const response = await api.get<Label3DResponse[]>(`label-3d?facilityId=${facilityId}`);
    return response.data;
  },

  post: async (data: Label3DCreateRequest): Promise<Response> => {
    return await api.post('label-3d', data);
  },

  patch: async (id: string, data: Label3DUpdateRequest): Promise<Response> => {
    return await api.patch(`label-3d/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`label-3d/${id}`);
  },
};
