import { useEffect } from "react";
import AssetCard from "./AssetCard";
import { useAssetStore } from '@plug/v1/common/store/assetStore';

const AssetList = () => {
    const { assets, isLoading, fetchAssets, error } = useAssetStore();

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Asset 목록</h2>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-primary-700">Asset을 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Asset 목록</h2>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline">
            {' '}
            Asset을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.
          </span>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Asset 목록</h2>
        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-600">등록된 Asset이 없습니다</p>
        </div>
      </div>
    );
  }
    
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {assets.map(asset => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>

    );
};

export default AssetList;