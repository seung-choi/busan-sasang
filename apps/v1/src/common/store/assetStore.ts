import { create } from 'zustand';
import { api } from '@plug/api-hooks';
import type { AssetResponse } from '@plug/common-services/types';

type AssetStoreState = {
  assets: AssetResponse[];
  selectedAsset: AssetResponse | null;
  isLoading: boolean;
  error: Error | null;
}

type AssetStoreActions = {
  fetchAssets: () => Promise<void>;
  fetchAssetById: (id: number) => Promise<void>;
  refreshAssets: () => Promise<void>;
  
  setSelectedAsset: (asset: AssetResponse | null) => void;
  clearSelectedAsset: () => void;
  reset: () => void;
}

type AssetStore = AssetStoreState & AssetStoreActions;

export const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  selectedAsset: null,
  isLoading: false,
  error: null,

  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AssetResponse[]>('assets');
      set({ 
        assets: response.data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching assets:', error);
      set({ 
        error: error as Error, 
        isLoading: false, 
        assets: [] 
      });
    }  },

  fetchAssetById: async (id: number) => {
    const existingAsset = get().assets.find(asset => asset.id === id);
    if (existingAsset) {
      set({ selectedAsset: existingAsset, error: null });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AssetResponse>(`assets/${id}`);
      set({ 
        selectedAsset: response.data,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching asset:', error);
      set({ 
        error: error as Error, 
        isLoading: false, 
        selectedAsset: null 
      });
    }
  },

  refreshAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AssetResponse[]>('assets');
      set({ 
        assets: response.data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error refreshing assets:', error);
      set({ 
        error: error as Error, 
        isLoading: false, 
        assets: [] 
      });
    }  },

  setSelectedAsset: (asset: AssetResponse | null) => {
    set({ selectedAsset: asset });
  },

  clearSelectedAsset: () => {
    set({ selectedAsset: null });
  },

  reset: () => {
    set({
      assets: [],
      selectedAsset: null,
      isLoading: false,
      error: null
    });
  }
}));
