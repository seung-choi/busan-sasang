import React, { useEffect, useState } from 'react';
import { api } from '@plug/api-hooks/core';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useSideMenuStore from '@plug/v1/app/stores/sideMenuStore';
import usePoiStore from '@plug/v1/app/stores/poiStore';
import { useAssetStore } from '@plug/v1/common/store/assetStore';
import MenuItem from './MenuItem';
import DevicePanel from './DevicePanel';
import { Tooltip } from '@plug/ui';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import type { Category } from '@plug/v1/app/modules/view/types/sidemenu';
import * as Px from '@plug/engine/src';

interface DeviceData {
  id: string;
  name: string;
  feature: {
    id: string;
    floorId: string;
  };
}

const SideMenu: React.FC = () => {
  const [devicesByCategory, setDevicesByCategory] = useState<Record<string, DeviceData[]>>({});
  
  const { 
    activeMenu, 
    menuItems, 
    isDevicePanelOpen, 
    setActiveMenu, 
    setMenuItems, 
    setIsDevicePanelOpen 
  } = useSideMenuStore();

  const { stationCode, currentFloor } = useStationStore();
  const { assets } = useAssetStore();
  const { setPendingPoiData } = usePoiStore();useEffect(() => {
    const fetchCategory = async () => {
      if (!stationCode) {
        return;
      }
      
      try {
        const response = await api.get<Category[]>(`devices/station/${stationCode}/grouped`);
        if (response.data) {
          const transformedMenuItems = response.data.map(item => ({
            id: item.categoryId.toString(),
            name: item.categoryName,
            type: item.contextPath.replace(/\//g, ''),
            icon: item.iconFile?.url,
            devices: item.devices || []
          }));          
          
          setMenuItems(transformedMenuItems);

          // 카테고리별 디바이스 데이터 저장
          const categoryDevices: Record<string, DeviceData[]> = {};
          response.data.forEach(category => {
            categoryDevices[category.categoryId.toString()] = category.devices.map(device => ({
              id: device.id,
              name: device.name,
              feature: {
                id: device.feature.id,
                floorId: device.feature.floorId
              }
            }));
          });
          setDevicesByCategory(categoryDevices);

          const allDevices = response.data.flatMap(category => 
            category.devices.map(device => ({
              ...device,
              categoryType: category.contextPath.replace(/\//g, '')
            }))
          );const poiData: PoiImportOption[] = allDevices.map(device => {
            const modelUrl = assets.find(asset => asset.id === parseInt(device.feature.assetId))?.file?.url || '';
            
            return {
              id: device.feature.id,
              iconUrl: '',
              modelUrl: modelUrl,
              displayText: device.name,
              floorId: device.feature.floorId,
              property: {
                deviceId: device.id,
                deviceType: device.categoryType
              },
              position: device.feature.position || { x: 0, y: 0, z: 0 }, // 기본 위치값
              rotation: device.feature.rotation || { x: 0, y: 0, z: 0 }, // 기본 회전값
              scale: device.feature.scale || { x: 1, y: 1, z: 1 } // 기본 스케일값
            };          });

          setPendingPoiData(poiData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    if (assets.length > 0) {
      fetchCategory();
    }  }, [stationCode, setMenuItems, assets, setPendingPoiData]);  // activeMenu가 변경될 때마다 POI 텍스트 제어
    useEffect(() => {
    // 모든 POI 텍스트 숨기기
    Px.Poi.HideAllDisplayText();
    
    // 활성화된 메뉴가 있고 해당 카테고리의 디바이스 데이터가 있으면 POI 텍스트 표시
    if (activeMenu && devicesByCategory[activeMenu.id]) {
      devicesByCategory[activeMenu.id].forEach(device => {
        // 현재 층이 'ALL'이거나 디바이스가 현재 층에 있을 때만 텍스트 표시
        if (currentFloor === 'ALL' || device.feature.floorId === currentFloor) {
          Px.Poi.ShowDisplayText(device.feature.id);
        }
      });
    }
  }, [activeMenu, devicesByCategory, currentFloor]);

  const handleMenuItemClick = (id: string) => {
    const clickedMenu = menuItems.find(item => item.id === id) || null;
    const newActive = activeMenu?.id === id ? null : clickedMenu;
    
    setActiveMenu(newActive);
    setIsDevicePanelOpen(newActive !== null);
  };

  return (
    <>
      <div className="fixed left-0 top-16 bottom-0 w-16 bg-gradient-to-b from-primary-900/30 to-primary-900/20 backdrop-blur-md flex flex-col items-center pt-4 px-2 z-30 shadow-xl border-r border-primary-100/5">
        <div className="flex-1 mt-2 space-y-3">
          {menuItems.map((item) => (
            <Tooltip key={item.id} position="right" trigger="hover" className="z-50 block">
              <Tooltip.Trigger className="w-full">
                <MenuItem
                  id={item.id}
                  icon={item.icon}
                  isActive={activeMenu?.id === item.id}
                  onClick={handleMenuItemClick}
                />
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-[#10385E] text-white backdrop-blur-md rounded-lg shadow-2xl px-4 py-2 text-sm font-medium after:bg-none after:content-none border border-primary-400/30">
                {item.name}
              </Tooltip.Content>
            </Tooltip>
          ))}
        </div>
      </div>
      {isDevicePanelOpen && activeMenu && (
        <DevicePanel
          categoryId={activeMenu.id}
          categoryName={activeMenu.name}
          categoryType={activeMenu.type}
          devices={activeMenu.devices}          onClose={() => {
            setActiveMenu(null);
            setIsDevicePanelOpen(false);
          }}
        />
      )}
    </>
  );
};

export default SideMenu;
