import React, { useState, useEffect } from 'react';
import * as Px from '@plug/engine/src';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useDeviceModalStore from '@plug/v1/app/stores/deviceModalStore';
import useSideMenuStore from '@plug/v1/app/stores/sideMenuStore';
import { nfluxService, nfluxWidgetService } from '@plug/v1/app/api';

interface DeviceData {
  id: string;
  name: string;
  code?: string;
  feature: DeviceFeature;
}

interface DeviceFeature {
  id: string;
  floorId: string;
  assetId: string;
}

interface DevicePanelProps {
  categoryId: string | null;
  categoryType: string;
  categoryName: string | null;
  devices: DeviceData[];
  onClose: () => void;
}

const DevicePanel: React.FC<DevicePanelProps> = ({
                                                   categoryId,
                                                   categoryType,
                                                   categoryName,
                                                   devices = [],
                                                   onClose
                                                 }) => {
  const { externalCode, setCurrentFloor } = useStationStore();
  const { openModal } = useDeviceModalStore();
  const { selectedMenus, toggleSelectedMenu, menuItems } = useSideMenuStore();

  const [searchValue, setSearchValue] = useState('');
  const [filteredDevices, setFilteredDevices] = useState<DeviceData[]>(devices);
  const [expandedSections, setExpandedSections] = useState<string[]>(['group', 'individual']);
  const [allDevices, setAllDevices] = useState<DeviceData[]>([]);

  const isSelected = categoryId ? selectedMenus.some(menu => menu.id === categoryId) : false;
  // const baseType = categoryType.endsWith('Groups')
  //   ? categoryType.replace(/Groups$/, '')
  //   : categoryType;

  const { groupDevices, individualDevices, hasGroups, hasIndividuals } = React.useMemo(() => {
    const groupItems: DeviceData[] = [];
    const individualItems: DeviceData[] = [];

    devices.forEach(device => {
      if (device.name.toLowerCase().includes('그룹')) {
        groupItems.push(device);
      } else {
        individualItems.push(device);
      }
    });

    return {
      groupDevices: groupItems.sort((a, b) => a.name.localeCompare(b.name)),
      individualDevices: individualItems.sort((a, b) => a.name.localeCompare(b.name)),
      hasGroups: groupItems.length > 0,
      hasIndividuals: individualItems.length > 0
    };
  }, [devices]);

  useEffect(() => {
    if (searchValue) {
      const filtered = allDevices.filter((device) =>
        device.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredDevices(filtered);
    } else {
      setFilteredDevices(allDevices);
    }
  }, [searchValue, allDevices]);

  useEffect(() => {
    setSearchValue('');
    setExpandedSections(['group', 'individual']);
  }, [categoryId]);

  useEffect(() => {
    const fetchDevices = async () => {
      if (categoryType === 'lights' || categoryType === 'lightGroups') {
        try {
          const lights = await nfluxService.getLights(categoryId || '');
          const lightgroups = await nfluxWidgetService.getLightGroups(categoryId || '');

          setAllDevices([
            ...lights.map(light => ({
              id: light.lightId,
              name: light.lightName,
              feature: {
                id: light.lightId,
                floorId:  '',
                assetId: '',
              },
            })),
            ...lightgroups.map(group => ({
              id: group.lightGroupId,
              name: group.lightGroupName,
              feature: {
                id: group.lightGroupId,
                floorId: '',
                assetId: '',
              },
            })),
          ]);
        } catch (error) {
          console.error('조명 데이터 가져오기 실패:', error);
        }
      }
    };

    fetchDevices();
  }, [categoryType, categoryId]);

  const handleDeviceClick = async (device: DeviceData) => {
    try {
      if (device.feature.id) {
        let deviceData = null;

        if (categoryType === 'lights') {
          const lights = await nfluxService.getLights(categoryId || '');
          deviceData = lights.find(light => light.lightId === device.id);
        } else if (categoryType === 'lightgroups') {
          const lightgroups = await nfluxWidgetService.getLightGroups(categoryId || '');
          deviceData = lightgroups.find(group => group.lightGroupId === device.id);
        }

        setCurrentFloor(device.feature.floorId);

        Px.Model.HideAll();
        Px.Model.Show(device.feature.floorId);
        Px.Camera.MoveToPoi(device.feature.id, 1.0);
        const evt = {
          type: 'onPoiSelect',
          target: { id: device.feature.id }
        };
        Px.EventDispatcher.InternalHandler.dispatchEvent(evt);

        if (deviceData) {
          console.log('장치 데이터:', deviceData);
          openModal(device.name, device.id, categoryType, String(externalCode));
        } else {
          console.error('장치를 찾을 수 없습니다. ID:', device.id);
        }
      }
    } catch (error) {
      console.error('장치 클릭 처리 중 오류 발생:', error);
    }
  };

  const handleToggleCategory = () => {
    if (categoryId) {
      const currentMenu = menuItems.find(item => item.id === categoryId);
      if (currentMenu) {
        toggleSelectedMenu(currentMenu);
      }
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const renderCategoryTitle = () => {
    if (!categoryName) return "장비 목록";

    let displayName = categoryName;

    if (categoryName.includes('-')) {
      const parts = categoryName.split('-');
      let mainPart = parts[1].trim();

      if (mainPart.includes('(')) {
        mainPart = mainPart.split('(')[0].trim();
      }

      displayName = mainPart;
    }

    return <span className="text-lg font-semibold text-white">{displayName}</span>;
  };

  const renderNormalDeviceList = (devices: DeviceData[]) => (
    <ul className="space-y-2 overflow-y-auto pr-1 h-[85%] custom-scrollbar">
      {devices
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((device) => (
          <li
            key={device.id}
            className="px-4 py-3 bg-primary-700/40 hover:bg-primary-600/40 rounded-lg cursor-pointer text-gray-200 hover:text-white transition-all flex items-center"
            onClick={() => {
              openModal(device.name, device.id, categoryType, String(externalCode));
              handleDeviceClick(device);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            {device.name}
          </li>
        ))}
    </ul>
  );

  const renderAccordionSections = () => {
    return (
      <div className="space-y-4 h-[85%] overflow-y-auto custom-scrollbar pr-1">
        {hasGroups && (
          <div className="bg-primary-800/30 rounded-lg overflow-hidden">
            <div
              className="px-4 py-3 bg-primary-700/60 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('group')}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/>
                  <path d="m7 16.5-4.74-2.85"/>
                  <path d="m7 16.5 5-3"/>
                  <path d="M7 16.5v5.17"/>
                  <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/>
                  <path d="m17 16.5-5-3"/>
                  <path d="m17 16.5 4.74-2.85"/>
                  <path d="M17 16.5v5.17"/>
                  <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/>
                  <path d="M12 8 7.26 5.15"/>
                  <path d="m12 8 4.74-2.85"/>
                  <path d="M12 13.5V8"/>
                </svg>
                <span className="text-white font-medium">그룹</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-300 mr-2">{groupDevices.length}개</span>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedSections.includes('group') ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedSections.includes('group') && (
              <ul className="mt-1 space-y-1 p-2">
                {groupDevices.map((device) => (
                  <li
                    key={device.id}
                    className="px-4 py-2.5 bg-primary-700/30 hover:bg-primary-600/40 rounded-lg cursor-pointer text-gray-200 hover:text-white transition-all flex items-center"
                    onClick={() => {
                      openModal(device.name, device.id, categoryType, String(externalCode));
                      handleDeviceClick(device);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    {device.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {hasIndividuals && (
          <div className="bg-primary-800/30 rounded-lg overflow-hidden">
            <div
              className="px-4 py-3 bg-primary-700/60 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection('individual')}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-white font-medium">개별</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-300 mr-2">{individualDevices.length}개</span>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedSections.includes('individual') ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedSections.includes('individual') && (
              <ul className="mt-1 space-y-1 p-2">
                {individualDevices.map((device) => (
                  <li
                    key={device.id}
                    className="px-4 py-2.5 bg-primary-700/30 hover:bg-primary-600/40 rounded-lg cursor-pointer text-gray-200 hover:text-white transition-all flex items-center"
                    onClick={() => {
                      openModal(device.name, device.id, categoryType, String(externalCode));
                      handleDeviceClick(device);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10 15h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      <path
                        d="m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    {device.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!categoryId) {
    return null;
  }

  return (
    <>
      <div className="fixed left-16 top-16 bottom-0 w-72 bg-gradient-to-b from-primary-900/20 to-primary-900/5 backdrop-blur-lg p-4 z-20 transition-all duration-300 ease-in-out transform translate-x-0 border-r border-gray-100/10">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100/20 pb-3">
          <div className="flex flex-wrap items-center">
            {renderCategoryTitle()}
            {devices.length > 0 && (
              <span className="text-sm text-white/70 ml-2">
                {searchValue ? `${filteredDevices.length}/${devices.length}` : devices.length} 개
              </span>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <button
              onClick={handleToggleCategory}
              className={`relative inline-flex items-center py-1.5 px-3 rounded-full border ${
                isSelected
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'
                  : 'bg-gray-700/20 text-gray-300 border-gray-600/40 hover:bg-gray-700/40'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-1 focus:ring-offset-transparent transition-all duration-200`}
            >
              <span className="text-xs font-medium tracking-wide">{isSelected ? 'ON' : 'OFF'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close device panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {categoryName &&
          categoryName.includes('-') &&
          categoryName.includes('(') &&
          categoryName.includes(')') && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {categoryName
                .split('-')[1]
                .match(/\(([^)]+)\)/)?.[1]
                .split(',')
                .map((tag, index) => (
                  <div
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-white/70 font-medium border border-white/5"
                  >
                    {tag.trim()}
                  </div>
                ))}
            </div>
          )}

        {devices.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            해당 카테고리에 등록된 <br /> 장치가 없습니다.
          </p>
        )}

        {devices.length > 0 && (
          <>
            {/*<div className="mb-3">*/}
            {/*  <div className="relative">*/}
            {/*    <input*/}
            {/*      type="text"*/}
            {/*      className="w-full px-4 py-2 bg-primary-800/30 border border-gray-100/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500"*/}
            {/*      placeholder="장비 검색..."*/}
            {/*      value={searchValue}*/}
            {/*      onChange={(e) => setSearchValue(e.target.value)}*/}
            {/*    />*/}
            {/*    <svg*/}
            {/*      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"*/}
            {/*      xmlns="http://www.w3.org/2000/svg"*/}
            {/*      fill="none"*/}
            {/*      viewBox="0 0 24 24"*/}
            {/*      stroke="currentColor"*/}
            {/*    >*/}
            {/*      <path*/}
            {/*        strokeLinecap="round"*/}
            {/*        strokeLinejoin="round"*/}
            {/*        strokeWidth={2}*/}
            {/*        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"*/}
            {/*      />*/}
            {/*    </svg>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {searchValue ?
              renderNormalDeviceList(filteredDevices) :
              (hasGroups && hasIndividuals) ?
                renderAccordionSections() :
                renderNormalDeviceList(devices)
            }

            {filteredDevices.length === 0 && searchValue && (
              <p className="text-gray-400 text-center py-4">검색 결과가 없습니다.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DevicePanel;