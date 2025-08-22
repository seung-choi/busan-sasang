import { useState, useMemo } from 'react';
import * as Px from '@plug/engine/src';
import { AccordionIcon, Input, Select } from '@plug/ui';
import { useToastStore } from '@plug/v1/admin/components/hook/useToastStore';
import { StationWithFeatures, FeatureResponse } from '@plug/v1/admin/pages/Viewer/types/station';
import {PoiEditModal} from "@plug/v1/admin/pages/Viewer/components/PoiEditModal";
import {PoiImportOption} from "@plug/engine/dist/src/interfaces";

type Device = {
  id: string;
  categoryId: number;
  categoryName: string;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

interface SearchListProps {
  deviceData: Device[];
  featureData: StationWithFeatures;
  onFloorChange?: (floorId: string) => void;
}

export const SearchList = ({ deviceData, featureData, onFloorChange }: SearchListProps) => {
  const { addToast } = useToastStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<FeatureResponse | null>(null);

  const deviceFeatureMap = useMemo(() => {
    const map = new Map<string, FeatureResponse>();

    if (featureData && featureData.features && featureData.features.length > 0) {
      featureData.features.forEach(feature => {
        if (feature.deviceId) {
          map.set(feature.deviceId, feature);
        }
      });
    }

    return map;
  }, [featureData]);

  const floorOptions = useMemo(() => {
    const floors = featureData?.floors || [];
    return floors.map(floor => ({
      value: floor.floorId,
      label: floor.name.replace(/\(.*\)/g, '')
    }));
  }, [featureData?.floors]);

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    deviceData.forEach(device => {
      if (device.categoryName) {
        categories.add(device.categoryName);
      }
    });
    return Array.from(categories).map(category => ({
      value: category,
      label: category
    }));
  }, [deviceData]);

  const unassignedCount = useMemo(() => {
    return deviceData.filter(device => !deviceFeatureMap.has(device.id)).length;
  }, [deviceData, deviceFeatureMap]);

  const filteredData = useMemo(() => {
    let filtered = deviceData;

    if (showUnassigned) {
      filtered = filtered.filter(device => !deviceFeatureMap.has(device.id));
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFloor) {
      filtered = filtered.filter(device => {
        const feature = deviceFeatureMap.get(device.id);
        return feature && feature.floorId === selectedFloor;
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(device =>
        device.categoryName === selectedCategory
      );
    }

    return filtered;
  }, [deviceData, showUnassigned, searchTerm, selectedFloor, selectedCategory, deviceFeatureMap]);

  const handleFloorChange = (values: string[]) => {
    setSelectedFloor(values[0] || '');
  };

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategory(values[0] || '');
  };

  const toggleUnassignedView = () => {
    setShowUnassigned(!showUnassigned);
    if (!showUnassigned) {
      setSelectedFloor('');
    }
  };

  const handleItemClick = (deviceId: string, name: string) => {
    try {
      const feature = deviceFeatureMap.get(deviceId);

      if (!feature) {
        throw new Error(`${name}(${deviceId})에 해당하는 3D 오브젝트를 찾을 수 없습니다.`);
      }

      const featureId = feature.id.toLowerCase();
      const floorId = feature.floorId;

      if (onFloorChange && floorId) {
        onFloorChange(floorId);
      }

      if (!Px.Camera || typeof Px.Camera.MoveToPoi !== 'function') {
        throw new Error('카메라 이동 기능을 사용할 수 없습니다.');
      }

      setTimeout(() => {
        Px.Camera.MoveToPoi(featureId, 1.5);
      }, 500);

      addToast({
        variant: 'normal',
        title: `${name} 선택`,
        description: `${name} 위치로 이동합니다`
      });
    } catch (error) {
      console.error('카메라 이동 중 오류:', error);
      addToast({
        variant: 'critical',
        title: `오류 발생`,
        description: `${error}`
      });
    }
  };

  const handleDeviceEdit = (e: React.MouseEvent, device: Device) => {
    e.stopPropagation();
    const feature = deviceFeatureMap.get(device.id);

    if (!feature) {
      addToast({
        variant: 'critical',
        title: `오류`,
        description: `선택된 장치(${device.name})에 할당된 POI가 없습니다.`,
      });
      return;
    }

    setSelectedPoi(feature);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPoi(null);
  };

  return (
    <>
      <div className="flex flex-col h-full shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative bg-white rounded-lg">
            <Input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full pl-7 pr-4 py-2 border-0"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div
            className={`flex items-center justify-between mt-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${showUnassigned ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            onClick={toggleUnassignedView}
          >
            <div className="flex items-center">
              <svg
                className={`h-5 w-5 mr-2 ${showUnassigned ? 'text-primary-600' : 'text-gray-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-sm font-medium">할당되지 않은 목록 보기</span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${showUnassigned ? 'bg-primary-200 text-primary-800' : 'bg-gray-200 text-gray-700'}`}
            >
              {unassignedCount}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg mb-3">
            <div className="flex space-x-2">
              <Select
                className="text-xs text-gray-700 w-24"
                selected={selectedFloor ? [selectedFloor] : []}
                onChange={handleFloorChange}
                disabled={showUnassigned}
              >
                <div className="relative">
                  <Select.Trigger
                    className="h-8 px-2 text-xs overflow-hidden p-1"
                    placeholder="층 선택"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3">
                    <AccordionIcon />
                  </div>
                </div>
                <Select.Content>
                  <Select.Item value="" className="text-xs">
                    전체 층
                  </Select.Item>
                  {floorOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
              <Select
                className="text-xs text-gray-700 w-36"
                selected={selectedCategory ? [selectedCategory] : []}
                onChange={handleCategoryChange}
              >
                <div className="relative">
                  <Select.Trigger
                    className="h-8 px-2 text-xs overflow-hidden p-1"
                    placeholder="카테고리"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-3 h-3">
                    <AccordionIcon />
                  </div>
                </div>
                <Select.Content>
                  <Select.Item value="" className="text-xs">
                    전체 카테고리
                  </Select.Item>
                  {categoryOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div className="text-sm text-gray-500">검색 결과 {filteredData.length} 개</div>
          </div>

          {filteredData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-40 text-gray-500">
              <svg
                className="h-12 w-12 text-gray-300 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredData.map((device) => {
                const hasFeature = deviceFeatureMap.has(device.id);

                return (
                  <li
                    key={device.id}
                    className={`p-4 bg-white hover:bg-primary-200/30 hover:brightness-110 rounded-xl border border-gray-200 hover:border-primary-300
                    ${hasFeature ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} 
                    transition-all duration-300 flex justify-between gap-5 items-center`}
                    onClick={() => hasFeature && handleItemClick(device.id, device.name)}
                  >
                    <div className="flex flex-col gap-2 justify-between w-full">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-700 truncate">{device.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {device.categoryName}
                        </span>

                        {!hasFeature ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            할당되지 않음
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500 flex items-center">
                            {(() => {
                              const feature = deviceFeatureMap.get(device.id);
                              if (!feature) return null;

                              const floorId = feature.floorId;
                              const floor = featureData.floors.find((f) => f.floorId === floorId);

                              if (!floor) return floorId;
                              return (
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                  {floor.name.replace(/\(.*\)/g, '')}
                                </div>
                              );
                            })()}
                          </span>
                        )}
                      </div>
                      {!showUnassigned &&
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{device.id}</span>
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-100/50 text-secondary-700 cursor-pointer hover:bg-secondary-200/60"
                            onClick={(e) => handleDeviceEdit(e, device)}
                          >
                            수정
                          </span>
                        </div>
                      }
                    </div>
                    {hasFeature && (
                      <svg
                        className="h-5 w-5 text-primary-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      {selectedPoi && (
        <PoiEditModal
          poi={selectedPoi as unknown as PoiImportOption}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default SearchList;