import React, { useEffect, useState } from 'react';
import { api } from '@plug/api-hooks/core';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useSideMenuStore from '@plug/v1/app/stores/sideMenuStore';
import usePoiStore from '@plug/v1/app/stores/poiStore';
import { useAssetStore } from '@plug/v1/common/store/assetStore';
import MenuItem from './MenuItem';
import DevicePanel from './DevicePanel';
import { Tooltip } from '@plug/ui';
import type { PoiImportOption } from '@plug/engine/dist/src/interfaces';
import type { Category } from '@plug/v1/app/view/types/sidemenu';
import * as Px from '@plug/engine/src';
import SearchPanel from '@plug/v1/app/view/layouts/SideMenu/SearchPanel';

interface DeviceData {
  id: string;
  name: string;
  code?: string;
  feature: {
    id: string;
    floorId: string;
    assetId: string;
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
  };
}

const SideMenu: React.FC = () => {
  const [devicesByCategory, setDevicesByCategory] = useState<Record<string, DeviceData[]>>({});

  const {
    activeMenu,
    selectedMenus,
    menuItems,
    isDevicePanelOpen,
    setActiveMenu,
    toggleSelectedMenu,
    setMenuItems,
    setIsDevicePanelOpen,
    addSelectedMenu,
    removeSelectedMenu
  } = useSideMenuStore();

  const { stationCode, currentFloor } = useStationStore();
  const { assets } = useAssetStore();
  const { setPendingPoiData } = usePoiStore();

  useEffect(() => {
    const fetchCategory = async () => {
      if (!stationCode) {
        return;
      }

      try {
        const response = await api.get<Category[]>(`devices/station/${stationCode}/grouped`);
        if (response.data) {

          const mergedCategories = mergeGroupAndIndividualCategories(response.data);
          const transformedMenuItems = mergedCategories.map(item => ({
            id: item.categoryId.toString(),
            name: item.categoryName,
            type: item.contextPath,
            icon: item.iconFile?.url,
            devices: item.devices || []
          }));

          setMenuItems(transformedMenuItems);
          const categoryDevices: Record<string, DeviceData[]> = {};
          mergedCategories.forEach(category => {
            categoryDevices[category.categoryId.toString()] = category.devices.map(device => ({
              id: device.id,
              name: device.name,
              feature: {
                id: device.feature.id,
                floorId: device.feature.floorId,
                assetId: device.feature.assetId,
                position: device.feature.position,
                rotation: device.feature.rotation,
                scale: device.feature.scale
              }
            }));
          });
          setDevicesByCategory(categoryDevices);

          const allDevices = mergedCategories.flatMap(category =>
            category.devices.map(device => ({
              ...device,
              categoryType: category.contextPath
            }))
          );

          const poiData: PoiImportOption[] = allDevices.map(device => {
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
              position: device.feature.position || { x: 0, y: 0, z: 0 },
              rotation: device.feature.rotation || { x: 0, y: 0, z: 0 },
              scale: device.feature.scale || { x: 1, y: 1, z: 1 }
            };
          });

          setPendingPoiData(poiData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (assets.length > 0) {
      fetchCategory();
    }
  }, [stationCode, setMenuItems, assets, setPendingPoiData]);


  const mergeGroupAndIndividualCategories = (categories: Category[]): Category[] => {

    const baseTypeMap: Record<string, string> = {
      'shutterGroups': 'shutters',
      'lightGroups': 'lights',
    };

    const typeToCategory: Record<string, Category> = {};
    categories.forEach(category => {
      const path = category.contextPath.replace(/\//g, '');
      typeToCategory[path] = category;
    });

    const result: Category[] = [];
    const processedTypes = new Set<string>();

    categories.forEach(category => {
      const type = category.contextPath.replace(/\//g, '');

      if (processedTypes.has(type)) {
        return;
      }

      if (type.endsWith('Groups')) {
        const baseType = baseTypeMap[type];

        if (baseType && typeToCategory[baseType]) {
          const individualCategory = typeToCategory[baseType];
          const groupCategory = category;

          const combinedDevices = [
            ...groupCategory.devices,
            ...individualCategory.devices
          ];

          const combinedCategory: Category = {
            ...individualCategory,
            devices: combinedDevices
          };

          result.push(combinedCategory);
          processedTypes.add(type);
          processedTypes.add(baseType);
        } else {
          result.push(category);
          processedTypes.add(type);
        }
      }
      else if (!processedTypes.has(type)) {
        const groupType = Object.keys(baseTypeMap).find(key => baseTypeMap[key] === type);
        if (!groupType || !typeToCategory[groupType]) {
          result.push(category);
          processedTypes.add(type);
        }
      }
    });

    return result;
  };

  useEffect(() => {
    Px.Poi.HideAllDisplayText();

    if (selectedMenus.length > 0) {
      selectedMenus.forEach(menu => {
        if (devicesByCategory[menu.id]) {
          devicesByCategory[menu.id].forEach(device => {
            if (currentFloor === 'ALL' || device.feature.floorId === currentFloor) {
              Px.Poi.ShowDisplayText(device.feature.id);
            }
          });
        }
      });
    }
  }, [selectedMenus, devicesByCategory, currentFloor]);

  const handleMenuItemClick = (id: string) => {
    const clickedMenu = menuItems.find(item => item.id === id) || null;

    if (clickedMenu) {
      if (!activeMenu || activeMenu.id !== id) {
        if (!selectedMenus.some(menu => menu.id === id)) {
          toggleSelectedMenu(clickedMenu);
        }
      }

      const isAlreadyActive = activeMenu?.id === id;
      if (isAlreadyActive) {
        setActiveMenu(null);
        setIsDevicePanelOpen(false);
      } else {
        setActiveMenu(clickedMenu);
        setIsDevicePanelOpen(true);
      }
    }
  };

  const handleSelectAll = () => {
    menuItems.forEach(item => {
      if (!selectedMenus.some(menu => menu.id === item.id)) {
        addSelectedMenu(item);
      }
    });
  };

  const handleDeselectAll = () => {
    selectedMenus.forEach(menu => {
      removeSelectedMenu(menu.id);
    });
  };

  const isAllSelected = menuItems.length > 0 && selectedMenus.length === menuItems.length;

  return (
    <>
      <div className="fixed left-0 top-16 bottom-0 w-16 bg-gradient-to-b from-primary-900/30 to-primary-900/20 backdrop-blur-md flex flex-col items-center pt-4 px-2 z-30 shadow-xl border-r border-primary-100/5">
        <div className="flex-1 space-y-3 custom-scrollbar">
          {menuItems
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => (
              <Tooltip key={item.id} position="right" trigger="hover" className="z-50 block">
                <Tooltip.Trigger className="w-full">
                  <MenuItem
                    id={item.id}
                    icon={item.icon}
                    isActive={selectedMenus.some((menu) => menu.id === item.id)}
                    isCurrentPanel={activeMenu?.id === item.id}
                    onClick={handleMenuItemClick}
                  />
                </Tooltip.Trigger>
                <Tooltip.Content className="bg-primary-900/90 text-white backdrop-blur-md rounded-lg shadow-2xl px-3 py-1.5 text-xs font-medium after:bg-none after:content-none border border-primary-400/20">
                  {item.name}
                </Tooltip.Content>
              </Tooltip>
            ))}
        </div>

        <div className="mb-4 w-full space-y-2">
          <button
            onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
            className={`relative inline-flex w-full items-center justify-center py-1.5 rounded-lg border ${
              isAllSelected
                ? 'bg-primary-500/20 text-primary-400 border-primary-500/30 hover:bg-primary-500/30'
                : 'bg-gray-700/20 text-gray-400 border-gray-600/30 hover:bg-gray-700/30'
            } focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:ring-offset-1 focus:ring-offset-transparent transition-all duration-200`}
          >
            <span className="text-xs font-medium">{isAllSelected ? 'OFF' : 'ON'}</span>
          </button>
        </div>
      </div>

      <SearchPanel />

      {isDevicePanelOpen && activeMenu && (
        <DevicePanel
          categoryId={activeMenu.id}
          categoryName={activeMenu.name}
          categoryType={activeMenu.type}
          devices={activeMenu.devices}
          onClose={() => {
            setActiveMenu(null);
            setIsDevicePanelOpen(false);
          }}
        />
      )}
    </>
  );
};

export default SideMenu;