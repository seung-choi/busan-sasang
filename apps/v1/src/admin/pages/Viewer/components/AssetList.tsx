import { useEffect } from "react";
import AssetCard from "./AssetCard";
import { useAssetStore } from "../../../../common/store/assetStore"; // Asset 스토어 import

const AssetList = () => {
    const { assets, isLoading, fetchAssets, error } = useAssetStore(); // 스토어에서 상태와 액션 가져오기

    useEffect(() => {
        fetchAssets(); // 컴포넌트 마운트 시 Asset 목록 가져오기
    }, [fetchAssets]);

    if (isLoading) {
        return (
            <div className="p-4">
                <h2 className="text-lg font-bold mb-4">Asset List</h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse text-gray-500">Loading assets...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <h2 className="text-lg font-bold mb-4">Asset List</h2>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> Could not fetch assets. Please try again later.</span>
                </div>
            </div>
        );
    }
    
    if (assets.length === 0) {
        return (
            <div className="p-4">
                <h2 className="text-lg font-bold mb-4">Asset List</h2>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No assets found</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {assets.map(asset => (
                    <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
        </div>
    );
};

export default AssetList;